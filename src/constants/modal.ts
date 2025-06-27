export const walletSwitchModal =
  '<h4>Are you sure you want to select this address as your main one?</h4>';

export const deleteStoryModal = `
  <h4>Are you sure you want to delete this story?</h4>
  <h5>This action is irreversible. You will lose it forever!</h5>
`;

export const deleteUnfinishedModal = `
  <h4>Are you sure you want to delete this story?</h4>
  <h5>This action is irreversible. You will lose all progress on this story.</h5>
`;

export const referralWarning = `
  <h4>This World Opens with a Code</h4>
  <p>To play stories and build your world, you'll need a referral code. It’s not about keeping people out — it’s about inviting the right people in.</p>
`;

export const referralActivationNotice = `
  <h4>Activate Your Account First</h4>
  <p>Before you can invite others, you need to activate your own account with a referral code. You’re just one step away.</p>
`;

export const refreshDataModal = `
  <p>This will force a CoNexus reload, and remove old stored files - letting you the latest version of the platform with the newest content. It won't affect your local settings.</p>
`;

export const resetSettingsModal = (type: any) =>
  `<h4>Are you sure you want to reset ${type} settings?</h4>`;

export const resetDreamModal = `<h4>Are you sure you want to reset all data?</h4>`;

export const openStoryManage = `
  <h4>Dream created!</h4>
  <p>You can now customize, share, or edit your story. Want to head to the manage panel?</p>
`;

export const gameRulesModal = `
  <h3 class="text-glowing">HOW TO PLAY CONEXUS</h3>

  <h5>Every story begins with a choice — make yours with a click.</h5>
  <p>Use the mouse to explore — or enhance the journey with keyboard shortcuts:</p>

  <ul class="keyboard-instructions">
    <li><span class="keyboard-btn">↑</span> / <span class="keyboard-btn">↓</span> — navigate choices</li>
    <li><span class="keyboard-btn">↵ Enter</span> — select an option</li>
    <li><span class="keyboard-btn">←</span> / <span class="keyboard-btn">→</span> — move between steps</li>
    <li><span class="keyboard-btn">F</span> — toggle fullscreen</li>
    <li><span class="keyboard-btn">M</span> — toggle mute</li>
    <li><span class="keyboard-btn">Z</span> - toggle zoomed-out mode to fit all content in view</li>
  </ul>

  <h5>Want full control? It’s yours.</h5>

  <p>Use the control panel below to navigate and customize the experience. Tune the music, voice, and pacing to match your style — everything is adjustable. This journey bends to you.</p>
`;
