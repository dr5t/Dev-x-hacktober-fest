import os
import sys
import asyncio
import subprocess
import wave
import struct
import edge_tts
import imageio_ffmpeg

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

video_in = "/Users/shauryatiwari/Dev x hacktober fest/StudyBuddy_Local_Demo.mp4"
standalone_wav_out = "/Users/shauryatiwari/Dev x hacktober fest/StudyBuddy_Local_Voiceover.wav"
final_mp4_out = "/Users/shauryatiwari/Dev x hacktober fest/StudyBuddy_Local_Demo_Final.mp4"

temp_dir = "/tmp/voiceover_build_v2"
os.makedirs(temp_dir, exist_ok=True)

# EXACT VOICE-OVER SCRIPT AND TIMINGS (aligned with 110.44s video)
script_scenes = [
    # Scene 1: [00:00 - 00:06]
    {
        "text": "Welcome to StudyBuddy Local, a private AI study companion I built for a college friend who struggles with scattered notes during exam prep.",
        "start": 0.5,
        "rate": "+5%"
    },
    # Scene 2: [00:06 - 00:11]
    {
        "text": "Everything runs locally on your machine. Just paste your study material or upload your notes.",
        "start": 6.2,
        "rate": "+5%"
    },
    # Scene 3: [00:11 - 00:26]
    {
        "text": "With one click, the local open-weight model summarizes the material and extracts the core concepts into an easy-to-read format, without sending the notes to an external AI service.",
        "start": 13.0,
        "rate": "+5%"
    },
    # Scene 4: [00:26 - 00:43]
    {
        "text": "For difficult topics, you can ask for a focused explanation. Here, we ask it to explain the Calvin Cycle in simple terms, and it generates a step-by-step explanation from the provided material.",
        "start": 27.0,
        "rate": "+5%"
    },
    # Scene 5: [00:43 - 00:58]
    {
        "text": "You can also create revision notes with key definitions, important points, and exam-focused takeaways for quick review.",
        "start": 44.0,
        "rate": "+5%"
    },
    # Scene 6: [00:58 - 01:16]
    {
        "text": "To test your understanding, StudyBuddy generates multiple-choice quizzes from your material. Select your answers, submit the quiz, and instantly see your score and explanations.",
        "start": 57.0,
        "rate": "+5%"
    },
    # Scene 7: [01:16 - 01:31]
    {
        "text": "The Q and A mode lets you ask questions about your notes, with responses grounded in the study material you provided.",
        "start": 77.0,
        "rate": "+5%"
    },
    # Scene 8: [01:31 - 01:39]
    {
        # Pronunciation hints: "oh-LAH-ma", "Qwen two point five"
        "text": "The diagnostics panel confirms that oh-LAH-ma is running locally with the Qwen two point five model and no external AI API is required.",
        "start": 92.5,
        "rate": "+5%"
    },
    # Scene 9: [01:39 - 01:50]
    {
        "text": "StudyBuddy Local makes exam preparation more organized while keeping your study material on your own machine. Thanks for watching.",
        "start": 100.5,
        "rate": "+5%"
    }
]

voice = "en-IN-PrabhatNeural"

async def generate_clips():
    print(f"Synthesizing voice audio using voice '{voice}'...")
    clip_files = []
    
    for idx, scene in enumerate(script_scenes):
        mp3_file = os.path.join(temp_dir, f"scene_{idx+1}.mp3")
        wav_file = os.path.join(temp_dir, f"scene_{idx+1}.wav")
        
        comm = edge_tts.Communicate(scene["text"], voice, rate=scene["rate"])
        await comm.save(mp3_file)
        
        # Convert MP3 to PCM WAV 44100Hz stereo
        cmd = [
            ffmpeg, "-y", "-i", mp3_file,
            "-ar", "44100", "-ac", "2", "-c:a", "pcm_s16le", wav_file
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        clip_files.append((wav_file, scene["start"]))
        print(f"  Scene {idx+1}: Start={scene['start']}s")
        
    return clip_files

def mix_full_narration_wav(clip_files, total_duration_sec=110.44, sample_rate=44100, channels=2):
    print("Mixing speech segments into full-length timeline WAV...")
    total_samples = int(total_duration_sec * sample_rate)
    buffer = bytearray(total_samples * channels * 2)
    
    for wav_file, start_t in clip_files:
        start_sample = int(start_t * sample_rate)
        with wave.open(wav_file, 'rb') as wf:
            n_channels = wf.getnchannels()
            n_frames = wf.getnframes()
            data = wf.readframes(n_frames)
            
            samples = struct.unpack(f"<{n_frames * n_channels}h", data)
            
            for i in range(n_frames):
                target_frame = start_sample + i
                if target_frame >= total_samples:
                    break
                
                left = samples[i * n_channels]
                right = samples[i * n_channels + (1 if n_channels > 1 else 0)]
                
                buf_offset = target_frame * channels * 2
                struct.pack_into("<hh", buffer, buf_offset, left, right)

    if os.path.exists(standalone_wav_out):
        os.remove(standalone_wav_out)
        
    with wave.open(standalone_wav_out, 'wb') as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(buffer)
        
    print(f"Created standalone WAV audio at: {standalone_wav_out}")

def merge_audio_and_video():
    print(f"Merging voiceover WAV with original screen recording to create {final_mp4_out}...")
    if os.path.exists(final_mp4_out):
        os.remove(final_mp4_out)
        
    cmd = [
        ffmpeg, "-y",
        "-i", video_in,
        "-i", standalone_wav_out,
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        final_mp4_out
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print("FFmpeg Error:", res.stderr)
        raise RuntimeError("FFmpeg merge failed!")
    print("Merge complete!")

async def main():
    clips = await generate_clips()
    mix_full_narration_wav(clips)
    merge_audio_and_video()
    
    print("\n==================================================")
    print("QUALITY CONTROL & VERIFICATION REPORT")
    print("==================================================")
    
    # Check A: Standalone Audio
    wav_exists = os.path.exists(standalone_wav_out)
    wav_size = os.path.getsize(standalone_wav_out) if wav_exists else 0
    print(f"A. Standalone Voiceover WAV:")
    print(f"   - Path: {standalone_wav_out}")
    print(f"   - Exists: {wav_exists}")
    print(f"   - Size: {wav_size / (1024*1024):.2f} MB")
    
    # Check B: Final Video
    mp4_exists = os.path.exists(final_mp4_out)
    mp4_size = os.path.getsize(final_mp4_out) if mp4_exists else 0
    print(f"\nB. Final Merged MP4 Video:")
    print(f"   - Path: {final_mp4_out}")
    print(f"   - Exists: {mp4_exists}")
    print(f"   - Size: {mp4_size / (1024*1024):.2f} MB")
    
    cmd = [ffmpeg, "-i", final_mp4_out]
    probe = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
    print(f"\nC. FFmpeg Probe Analysis:")
    for line in probe.stderr.split('\n'):
        if any(k in line for k in ["Duration:", "Stream #0:0", "Stream #0:1"]):
            print("   ", line.strip())

if __name__ == "__main__":
    asyncio.run(main())
