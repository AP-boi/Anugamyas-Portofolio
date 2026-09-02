'use client';

// Sound effects completely removed/disabled
class SoundEngine {
  public enabled: boolean = false;

  playClick() {}
  playWindowOpen() {}
  playWindowClose() {}
  playUnlockChime() {}
  playTrash() {}
  playNotify() {}
  playKeypress() {}
  toggleSound(): boolean {
    this.enabled = false;
    return false;
  }
}

export const sounds = new SoundEngine();
