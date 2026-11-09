 Chat
 [Download Playlist Transcripts](https://chatgpt.com/g/g-p-6aeca3a7b7a481919ff0853bc1a61db8-misc-tech/c/6aeca3ad-a9e0-83ea-aae8-3962defb3801?src=history_search)

## Step 1: 
- Close Edge (or other) bcause will be using YT account

## Step 2:
- Download transcript using the yt_dlp library (install before):
- Set the output folder in "transcript_in" in the command
- 
-  in Powershell run 
- `py -m yt_dlp `
  --cookies-from-browser edge `
  --skip-download `
  --ignore-errors `
  --ignore-no-formats-error `
  --yes-playlist `
  --write-subs `
  --write-auto-subs `
  --write-info-json `
  --no-write-playlist-metafiles `
  --sub-langs "en-orig,en" `
  --sub-format vtt `
  -o "transcript_in/%(playlist_index)03d - %(title)s.%(ext)s" `
  "https://www.youtube.com/playlist?list=PLJRYKNJxAx9NJaMHXWvV1EF0VJLvsW9vb"`

