// Micro-templates for modals rendered through the global modal store
export const ensureMessage = (message: string = 'remove this') => `
  <h4>Are you sure you want to ${message}?</h4>
`;

export const restoreDraft = (title: string) => `
  <h4>Restore this draft?</h4>
  <p>Open “${title}” in the creator with all fields prefilled.</p>
`;

export const disableAccountWarning = `
  <h4>Disable User Account?</h4>
  <p>This is a soft delete. The user loses access immediately. Data stays in the database and can be restored later.</p>
`;

export const referralWarning = `
  <h4>This World Opens with a Code</h4>
  <p>To play stories and build your world, you'll need a referral code. It’s not about keeping people out — it’s about inviting the right people in.</p>
`;

export const referralActivationNotice = `
  <h4>Activate Your Account First</h4>
  <p>Before you can invite others, you need to activate your own account with a referral code. You’re just one step away.</p>
`;

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
