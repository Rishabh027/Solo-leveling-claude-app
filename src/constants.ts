import { Reward, Character } from "./types";

export const RANKS = [
  { r: 'E', minXP: 0, title: 'E-Rank Awakened' },
  { r: 'D', minXP: 500, title: 'D-Rank Hunter' },
  { r: 'C', minXP: 1500, title: 'C-Rank Hunter' },
  { r: 'B', minXP: 3500, title: 'B-Rank Hunter' },
  { r: 'A', minXP: 7000, title: 'A-Rank Hunter' },
  { r: 'S', minXP: 15000, title: 'S-Rank Legend' }
];

export const ACHIEVEMENTS = [
  { id: 'first_act', icon: '⚡', name: 'First Step', desc: 'Log your first activity' },
  { id: 'week_streak', icon: '🔥', name: 'Week Warrior', desc: '7-day streak' },
  { id: 'month_streak', icon: '💥', name: 'Unstoppable', desc: '30-day streak' },
  { id: 'gym10', icon: '🏋️', name: 'Iron Will', desc: 'Log 10 gym sessions' },
  { id: 'gym50', icon: '💪', name: 'Hunter Body', desc: 'Log 50 gym sessions' },
  { id: 'invest5', icon: '💰', name: 'Wealth Seeker', desc: 'Log 5 investments' },
  { id: 'quest10', icon: '🎯', name: 'Quest Master', desc: 'Complete 10 quests' },
  { id: 'proj5', icon: '🛠', name: 'Builder', desc: 'Create 5 projects' },
  { id: 'tasks50', icon: '✅', name: 'Task Slayer', desc: 'Complete 50 tasks' },
  { id: 'pts1000', icon: '💎', name: 'Point Hunter', desc: 'Earn 1000 points' },
  { id: 'rank_d', icon: '🔵', name: 'D-Rank Achieved', desc: 'Reach D-Rank' },
  { id: 'rank_s', icon: '🔴', name: 'S-Rank Legend', desc: 'Reach S-Rank' },
];

export const DEFAULT_REWARDS: Reward[] = [
  { id: 1, icon: '🗡️', name: 'Knight Killer', desc: 'A heavy dagger. (Reward: 1hr Gaming Session)', cost: 150, type: 'default' },
  { id: 2, icon: '⚔️', name: 'Katana of the Sands', desc: 'A swift blade. (Reward: Cheat Meal)', cost: 200, type: 'default' },
  { id: 3, icon: '🧪', name: 'Healing Potion', desc: 'Restores vitality. (Reward: Movie Night)', cost: 100, type: 'default' },
  { id: 4, icon: '💧', name: 'Mana Booster', desc: 'Increases focus. (Reward: Small Purchase)', cost: 500, type: 'default' },
  { id: 5, icon: '🛡️', name: 'Gate Keeper Shield', desc: 'Solid protection. (Reward: Rest Day)', cost: 300, type: 'default' },
  { id: 6, icon: '😴', name: 'Restoration', desc: 'Full recovery. (Reward: Sleep in)', cost: 250, type: 'default' },
];

export const CHARACTERS: Character[] = [
  { 
    id: 'jinwoo_e', 
    name: 'Sung Jin-Woo (E-Rank)', 
    image: 'https://images.weserv.nl/?url=https://images.alphacoders.com/134/1346297.png', 
    rank: 'E', 
    desc: 'The world\'s weakest hunter.', 
    unlockRequirement: { xp: 0 } 
  },
  { 
    id: 'igris', 
    name: 'Blood-Red Commander Igris', 
    image: 'https://images.weserv.nl/?url=https://images.alphacoders.com/134/1346303.png', 
    rank: 'S', 
    desc: 'A knight of the red order.', 
    unlockRequirement: { tasks: 20, xp: 2000 } 
  },
  { 
    id: 'tank', 
    name: 'Tank', 
    image: 'https://images.weserv.nl/?url=https://images.alphacoders.com/134/1346299.png', 
    rank: 'A', 
    desc: 'Leader of the Ice Bears.', 
    unlockRequirement: { tasks: 40, xp: 5000 } 
  },
  { 
    id: 'iron', 
    name: 'Iron', 
    image: 'https://images.weserv.nl/?url=https://images.alphacoders.com/134/1346300.png', 
    rank: 'A', 
    desc: 'The shadow of Kim Chul.', 
    unlockRequirement: { tasks: 60, xp: 8000 } 
  },
  { 
    id: 'tusk', 
    name: 'Tusk', 
    image: 'https://images.weserv.nl/?url=https://images.alphacoders.com/134/1346301.png', 
    rank: 'S', 
    desc: 'The High Orc Shaman.', 
    unlockRequirement: { tasks: 80, xp: 12000 } 
  },
  { 
    id: 'beru', 
    name: 'Beru', 
    image: 'https://images.weserv.nl/?url=https://images.alphacoders.com/134/1346302.png', 
    rank: 'S', 
    desc: 'The Ant King.', 
    unlockRequirement: { tasks: 100, xp: 15000 } 
  },
];

export const SYSTEM_SHOP_ITEMS = [
  { id: 'itm_hp', icon: '🧪', name: 'Healing Potion', desc: 'Restores Energy to BEAST mode.', cost: 100, rarity: 'Common', type: 'Item' },
  { id: 'itm_mp', icon: '💧', name: 'Mana Potion', desc: 'Restores focus. Gain 50 XP instantly.', cost: 150, rarity: 'Common', type: 'Item' },
  { id: 'item_1', icon: '🗡️', name: "Kasaka's Venom Fang", desc: "A dagger made from a giant snake's tooth. (+10% passive XP gain)", cost: 1000, rarity: 'Rare', type: 'Weapon' },
  { id: 'item_2', icon: '🛡️', name: "Gate Keeper's Shield", desc: 'A sturdy shield that can withstand heavy blows.', cost: 1500, rarity: 'Rare', type: 'Armor' },
  { id: 'item_3', icon: '⚔️', name: 'Knight Killer', desc: 'A heavy sword designed to pierce armor.', cost: 2500, rarity: 'Epic', type: 'Weapon' },
  { id: 'item_4', icon: '🌀', name: 'Skill: Dash', desc: 'Instantly increase movement speed.', cost: 5000, rarity: 'Epic', type: 'Skill' },
  { id: 'item_5', icon: '🔥', name: 'Skill: Bloodlust', desc: 'Intimidate enemies and reduce their stats.', cost: 8000, rarity: 'Legendary', type: 'Skill' },
  { id: 'item_6', icon: '🌑', name: 'Shadow Extraction', desc: 'Extract shadows from the fallen to join your army.', cost: 20000, rarity: 'Legendary', type: 'Skill' },
];

const INITIAL_SYSTEM_QUESTS = [
  {d:1, t:"The 1% Rule", desc:"[Source: Atomic Habits] Make one microscopic improvement to your daily routine today. Momentum starts small.", instructions: ["Read or listen to a summary of 'Marginal Gains'.", "Identify one negative habit that drains your energy.", "Identify one tiny positive habit (under 2 minutes) you can start.", "Implement the positive habit immediately today.", "Write down how this habit will compound over the next 90 days."], xp:100, pts:50},
  {d:2, t:"Environment Design", desc:"[Source: Atomic Habits] Remove one visible distraction from your workspace and place one productive cue in plain sight.", instructions: ["Identify the room where you need the most focus.", "Remove your phone charger from this room.", "Place a physical book or journal directly on your desk.", "Ensure the lighting in your workspace is optimized for alertness.", "Take a mental snapshot of this new 'Hunter Zone'."], xp:100, pts:50},
  {d:3, t:"Habit Stacking", desc:"[Source: Atomic Habits] Attach a new tiny habit immediately following a habit you already do every single day.", instructions: ["Write down 3 things you do every morning without fail.", "Choose one new habit you want to build (e.g., stretching, reading).", "Create a rule: 'After I [current habit], I will [new habit]'.", "Execute this sequence flawlessly today.", "Log your success in the Daily timeline."], xp:100, pts:50},
  {d:4, t:"The 2-Minute Rule", desc:"[Source: Atomic Habits] Clear the small mobs. Stop procrastinating on tiny tasks.", instructions: ["Look around your immediate environment.", "Find 3 tasks that will take less than 2 minutes to complete.", "Do not write them down. Do them immediately.", "Experience the psychological relief of clearing micro-stressors.", "Commit to applying this rule to emails and messages tomorrow."], xp:100, pts:50},
  {d:5, t:"Identity Shift", desc:"[Source: Atomic Habits] Real change is identity-based. Write down the exact identity of the person you want to become.", instructions: ["Define your ultimate self. Are you a 'Reader', an 'Athlete', a 'Creator'?", "Stop saying 'I am trying to read'. Say 'I am a reader'.", "Take one action today that proves this new identity.", "Refuse to engage in one activity that contradicts this identity.", "Write your new identity statement on a sticky note."], xp:100, pts:50},
  {d:6, t:"System Over Goals", desc:"[Source: Atomic Habits] Focus entirely on your daily process today. Do not look at the end outcome.", instructions: ["Stop checking the scoreboard (followers, weight scale, bank account).", "Focus 100% of your energy on the inputs.", "Execute your daily routine without attachment to the result.", "Find joy in the execution of the work itself.", "Log your hours honestly in the System."], xp:100, pts:50},
  {d:7, t:"Track the Baseline", desc:"[Source: Atomic Habits] You cannot improve what you do not measure.", instructions: ["Review your logs in the Hunter OS from the past 6 days.", "Calculate your total XP and points earned.", "Identify the exact day your energy dipped the lowest.", "Identify what caused the failure.", "Set your primary target for Week 2."], xp:100, pts:50},
  {d:8, t:"The Deep Block", desc:"[Source: Deep Work] Complete 60 continuous minutes of zero-distraction, single-task focus. Phone in another room.", instructions: ["Choose a single, highly valuable task.", "Put your phone in another room. No exceptions.", "Close all browser tabs except the ones required for the task.", "Set a timer for 60 minutes.", "Work continuously until the timer sounds, ignoring all impulses to stop."], xp:120, pts:60},
  {d:9, t:"Digital Fasting", desc:"[Source: Deep Work] Train your brain to operate without instant dopamine gratification.", instructions: ["Keep your phone out of reach for the first 2 hours of your day.", "Consume zero social media during this time.", "Use the time to plan your day or read.", "Notice the psychological urge to check notifications, and dismiss it.", "Re-engage with technology only when required for work."], xp:120, pts:60},
  {d:10, t:"Batch the Shallow", desc:"[Source: Deep Work] Group all your low-value tasks into a single window to protect your deep focus.", instructions: ["Identify your 'shallow' tasks (emails, Slack, admin, chores).", "Refuse to do them sporadically throughout the day.", "Set a specific 45-minute window to blitz through all of them.", "Once the window closes, stop all shallow work.", "Return immediately to high-value execution."], xp:120, pts:60},
  {d:11, t:"Embrace Boredom", desc:"[Source: Deep Work] Stop destroying your attention span with constant stimulation.", instructions: ["Find a situation where you are waiting (in line, commuting).", "Refuse to pull out your phone.", "Observe your surroundings and allow your mind to wander.", "Do this at least three times today.", "Acknowledge that boredom is necessary for deep focus."], xp:120, pts:60},
  {d:12, t:"The Shutdown Ritual", desc:"[Source: Deep Work] Create a strict end-of-day shutdown routine to completely detach your mind from work.", instructions: ["Decide on a strict 'End of Work' time for today.", "Review all completed and incomplete tasks.", "Write down your plan for tomorrow.", "Close your laptop and say a shutdown phrase (e.g., 'System Offline').", "Refuse to think about work for the rest of the evening."], xp:120, pts:60},
  {d:13, t:"Metric Tracking", desc:"[Source: Deep Work] Measure the depth of your execution.", instructions: ["Track the exact number of minutes you spend in actual Deep Work today.", "Log this specific time in the Hunter OS.", "Compare it to your 'shallow work' time.", "Identify what broke your focus the most today.", "Draft a plan to eliminate that specific distraction tomorrow."], xp:120, pts:60},
  {d:14, t:"Distraction Purge", desc:"[Source: Deep Work] Eliminate the shadows draining your mana.", instructions: ["Identify the one app on your phone that steals the most time.", "Delete it from your phone for the next 24 hours.", "If it is a website, block it using an extension.", "Observe the anxiety of missing out (FOMO).", "Realize that you missed nothing important."], xp:120, pts:60},
  {d:15, t:"Accountability Mirror", desc:"[Source: Can't Hurt Me] Look in the mirror and brutally acknowledge your weaknesses. Stop lying to yourself.", instructions: ["Stand in front of a mirror alone.", "Speak out loud the exact excuses you have been using recently.", "Acknowledge that no one is coming to save you.", "Write down the most uncomfortable truth about your current progress.", "Formulate one action step to attack that weakness today."], xp:150, pts:80},
  {d:16, t:"The 40% Rule", desc:"[Source: Can't Hurt Me] When you feel completely exhausted and want to quit, you are only at 40%.", instructions: ["Engage in a difficult physical or mental task today.", "Wait until your brain tells you to stop and quit.", "Acknowledge the feeling of fatigue as a lie.", "Push exactly 10% further than you thought you could.", "Document the feeling of breaking past your false limit."], xp:150, pts:80},
  {d:17, t:"Embrace the Suck", desc:"[Source: Can't Hurt Me] Seek out discomfort actively. The obstacle is the way.", instructions: ["Look at your task list.", "Identify the task you are dreading the absolute most.", "Do not negotiate with yourself. Execute it immediately.", "Do not stop until it is 100% complete.", "Notice how the anticipation was worse than the execution."], xp:150, pts:80},
  {d:18, t:"The Cookie Jar", desc:"[Source: Can't Hurt Me] Draw strength from your past victories when the battle gets hard.", instructions: ["Write down 3 of the hardest things you have ever accomplished.", "Remember the exact feeling of suffering you endured to achieve them.", "When you hit a wall today, mentally open this 'Cookie Jar'.", "Remind yourself of who you are and what you have survived.", "Use that fuel to finish today's main objective."], xp:150, pts:80}
];

export const SYSTEM_QUESTS_90 = [...INITIAL_SYSTEM_QUESTS];

// Programmatically generate remaining days (19 to 90)
for(let i=19; i<=90; i++) {
  const themes = ["Focus Expansion", "Physical Conditioning", "System Optimization", "Network Cultivation", "Asset Accumulation"];
  SYSTEM_QUESTS_90.push({
    d: i,
    t: `${themes[i%5]} LV.${Math.floor(i/5)}`,
    desc: `System Directive: Continue executing core principles. Maintain the streak. Push past your limits.`,
    instructions: [
      "Review your baseline metrics for this specific skill.",
      "Identify the bottleneck holding back your progression.",
      "Apply 45 minutes of intense, unbroken focus to clearing it.",
      "Log your results in the System Database.",
      "Prepare your environment for tomorrow's continuation."
    ],
    xp: 150 + (Math.floor(i/10)*20),
    pts: 80 + (Math.floor(i/10)*10)
  });
}

export const SL_QUOTES = [
  { q: "I have come too far to give up now.", by: "Sung Jin-Woo" },
  { q: "Arise.", by: "Sung Jin-Woo — Shadow Monarch" },
  { q: "Don't worry. I'm used to the dark.", by: "Sung Jin-Woo" },
  { q: "Every moment I get stronger.", by: "Sung Jin-Woo" },
  { q: "The only person who can determine your own value is yourself.", by: "System" },
  { q: "No matter how hard or painful the road, the hunter keeps walking.", by: "System" },
  { q: "Level up. Again and again.", by: "System Notification" },
  { q: "You are the only one who can change your destiny.", by: "Sung Jin-Woo" },
  { q: "I'll become the strongest.", by: "Sung Jin-Woo" },
];

export const CAT_COLORS: Record<string, string> = {
  deep: '#4f8ef7',
  health: '#10b981',
  learn: '#b06ef3',
  project: '#22d3ee',
  admin: '#f5a623',
  social: '#f43f5e',
  creative: '#e879f9',
  rest: '#3d4566',
  chores: '#94a3b8',
  slack: '#ef4444'
};

export const CAT_LABELS: Record<string, string> = {
  deep: 'Deep Work',
  health: 'Health',
  learn: 'Learning',
  project: 'Project',
  admin: 'Admin',
  social: 'Social',
  creative: 'Creative',
  rest: 'Rest',
  chores: 'Chores',
  slack: 'Slack Off / Doomscroll'
};
