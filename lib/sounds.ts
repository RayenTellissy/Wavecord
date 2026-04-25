function play(file: string) {
  if (typeof window === "undefined") return;
  const audio = new Audio(`/sounds/${file}`);
  audio.volume = 0.5;
  audio.play().catch(() => {});
}

export const playMuteSound = () => play("mute.mp3");
export const playUnmuteSound = () => play("unmute.mp3");
export const playDeafenSound = () => play("deafen.mp3");
export const playUndeafenSound = () => play("undeafen.mp3");
export const playJoinSound = () => play("user_join.mp3");
export const playLeaveSound = () => play("disconnect.mp3");
