/**
 * ============================================================================
 * FitBuddy - Comprehensive Exercise Catalogue Data (exercise-data.js)
 * Clean, modular dataset of home & hostel exercises with target body parts,
 * equipment, sets, reps, step-by-step instructions, and form cues.
 * ============================================================================
 */

const EXERCISE_CATEGORIES = [
  'All',
  'Warm-up',
  'Chest',
  'Back',
  'Biceps',
  'Triceps',
  'Shoulders',
  'Abs',
  'Legs',
  'Full Body Circuit'
];

const TARGET_BODY_PARTS = [
  'All',
  'Chest',
  'Back',
  'Biceps',
  'Triceps',
  'Shoulders',
  'Abs',
  'Legs',
  'Full Body',
  'Warm-up'
];

const EXERCISES = [
  // --------------------------------------------------------------------------
  // CHEST EXERCISES
  // --------------------------------------------------------------------------
  {
    id: 'push-ups',
    name: 'Push-ups',
    category: 'Chest',
    targetBodyPart: 'Chest',
    musclesTargeted: 'Pectoralis Major, Anterior Deltoids, Triceps Brachii, Core',
    requiredEquipment: 'No Equipment',
    difficulty: 'Beginner',
    sets: '3 - 4 Sets',
    reps: '10 - 15 Reps',
    restDuration: '60 Seconds',
    instructions: [
      'Start in a high plank position with your hands slightly wider than shoulder-width, palms flat on the floor.',
      'Engage your core and squeeze your glutes so your body forms a straight line from your head to your heels.',
      'Lower your chest towards the floor by bending your elbows back at a 45-degree angle, keeping your neck neutral.',
      'Descend until your chest is about 2 inches off the ground, then press firmly through your palms to return to the starting position.'
    ],
    formTips: [
      'Avoid flaring your elbows out 90 degrees; keep them tucked at a 45-degree arrow shape.',
      'Do not let your lower back sag or your hips pike upward.',
      'Inhale as you lower your body down with control, and exhale as you press back up.'
    ],
    beginnerVariation: 'Incline Push-ups with your hands elevated on a study desk or bed, or Knee-Supported Push-ups on a soft mat.',
    fitnessGoals: ['Muscle Gain', 'Strength', 'General Fitness', 'Weight Management'],
    durations: [15, 30, 45, 60],
    iconType: 'chest-push'
  },
  {
    id: 'dumbbell-floor-press',
    name: 'Dumbbell Floor Press',
    category: 'Chest',
    targetBodyPart: 'Chest',
    musclesTargeted: 'Pectoralis Major (Mid & Lower), Triceps Brachii, Anterior Deltoids',
    requiredEquipment: 'Dumbbells',
    difficulty: 'Beginner',
    sets: '3 - 4 Sets',
    reps: '10 - 12 Reps',
    restDuration: '60 Seconds',
    instructions: [
      'Lie flat on the floor on a yoga mat with knees bent and feet planted firmly on the ground.',
      'Hold a dumbbell in each hand with your upper arms resting on the floor at a 45-degree angle from your torso.',
      'Press the dumbbells straight up over your chest until your arms are fully extended without banging the weights together.',
      'Slowly lower the dumbbells back down until your upper arms gently touch the floor, pause briefly to eliminate momentum, and repeat.'
    ],
    formTips: [
      'The floor acts as a natural shoulder safety buffer; do not bounce your elbows off the ground.',
      'Keep your wrists neutral and directly over your forearms throughout the press.',
      'Maintain contact with your upper back and glutes on the floor throughout the set.'
    ],
    beginnerVariation: 'Perform with light dumbbells or practice unilateral (one arm at a time) floor presses for greater core stabilization.',
    fitnessGoals: ['Muscle Gain', 'Strength'],
    durations: [30, 45, 60],
    iconType: 'chest-press'
  },
  {
    id: 'dumbbell-fly',
    name: 'Dumbbell Fly',
    category: 'Chest',
    targetBodyPart: 'Chest',
    musclesTargeted: 'Pectoralis Major (Sternal Head), Anterior Deltoids, Biceps Short Head',
    requiredEquipment: 'Dumbbells',
    difficulty: 'Intermediate',
    sets: '3 Sets',
    reps: '12 - 15 Reps',
    restDuration: '60 Seconds',
    instructions: [
      'Lie supine on the floor or a flat bench holding dumbbells directly above your chest with palms facing each other.',
      'Maintain a slight bend in your elbows (approx 15 degrees) that stays locked throughout the entire movement.',
      'In a wide arc motion, lower the dumbbells out to the sides until you feel a deep, comfortable stretch across your pectorals.',
      'Squeeze your chest muscles together to bring the dumbbells back along the same wide arc to the starting point.'
    ],
    formTips: [
      'Never lock your elbows completely straight to prevent excessive stress on the elbow joint and biceps tendon.',
      'If doing this on the floor, let your elbows gently brush the carpet at the bottom to prevent overextension.',
      'Focus on the mind-muscle chest squeeze at the top rather than lifting heavy weights.'
    ],
    beginnerVariation: 'Dumbbell Floor Fly where the floor safely stops the elbows before any shoulder strain occurs.',
    fitnessGoals: ['Muscle Gain', 'General Fitness'],
    durations: [30, 45, 60],
    iconType: 'chest-fly'
  },

  // --------------------------------------------------------------------------
  // BACK EXERCISES
  // --------------------------------------------------------------------------
  {
    id: 'one-arm-dumbbell-row',
    name: 'One Arm Dumbbell Row',
    category: 'Back',
    targetBodyPart: 'Back',
    musclesTargeted: 'Latissimus Dorsi, Rhomboids, Posterior Deltoid, Trapezius, Biceps',
    requiredEquipment: 'Dumbbells',
    difficulty: 'Beginner',
    sets: '3 - 4 Sets',
    reps: '10 - 12 Reps / side',
    restDuration: '60 Seconds',
    instructions: [
      'Stand in a split stance with one foot forward. Place your free hand on a sturdy chair, desk, or your front thigh for torso support.',
      'Hinge forward at the hips until your torso is at roughly a 45-degree angle to the floor, maintaining a neutral flat spine.',
      'Hold the dumbbell hanging straight down, then pull your elbow back towards your hip socket.',
      'Squeeze your shoulder blade inward at the top of the contraction for one second, then lower under control.'
    ],
    formTips: [
      'Think of your hand as a hook; initiate the pull by driving your elbow backward rather than pulling with your forearm.',
      'Do not rotate your torso or jerk your upper body upward to swing the weight.',
      'Keep your neck aligned with your spine by looking at a spot on the floor 3 feet ahead.'
    ],
    beginnerVariation: 'Doorframe Bodyweight Rows (holding a doorframe and pulling your chest in) or using a lighter weight with both hands supported.',
    fitnessGoals: ['Muscle Gain', 'Strength', 'General Fitness'],
    durations: [15, 30, 45, 60],
    iconType: 'back-row'
  },
  {
    id: 'dumbbell-pullover',
    name: 'Dumbbell Pullover',
    category: 'Back',
    targetBodyPart: 'Back',
    musclesTargeted: 'Latissimus Dorsi, Teres Major, Pectorals, Serratus Anterior',
    requiredEquipment: 'Dumbbells',
    difficulty: 'Intermediate',
    sets: '3 Sets',
    reps: '10 - 12 Reps',
    restDuration: '60 Seconds',
    instructions: [
      'Lie flat on your back on the floor or a bench holding a single dumbbell with both hands in a diamond grip under the inner bell plate.',
      'Position the dumbbell directly over your chest with arms slightly bent at the elbows.',
      'Slowly lower the dumbbell backward over your head in an arc until your upper arms are in line with your torso.',
      'Engage your lats to pull the dumbbell back along the arc to the starting position above your chest.'
    ],
    formTips: [
      'Keep your core tight and do not allow your lower back to excessively arch off the ground.',
      'Maintain the fixed slight elbow bend throughout; do not turn this into a tricep extension.',
      'Breathe in deeply as the dumbbell descends to expand the ribcage, and exhale on the pull.'
    ],
    beginnerVariation: 'Floor Pullover using light weight or a light resistance band anchored to a sturdy bed post.',
    fitnessGoals: ['Muscle Gain', 'Strength'],
    durations: [30, 45, 60],
    iconType: 'back-pullover'
  },

  // --------------------------------------------------------------------------
  // BICEPS EXERCISES
  // --------------------------------------------------------------------------
  {
    id: 'dumbbell-curl',
    name: 'Dumbbell Curl',
    category: 'Biceps',
    targetBodyPart: 'Biceps',
    musclesTargeted: 'Biceps Brachii (Short & Long Heads), Brachialis, Forearm Flexors',
    requiredEquipment: 'Dumbbells',
    difficulty: 'Beginner',
    sets: '3 Sets',
    reps: '10 - 12 Reps',
    restDuration: '45 Seconds',
    instructions: [
      'Stand upright or sit tall on a study chair with a dumbbell in each hand, arms extended down by your sides with palms facing forward.',
      'Keeping your elbows stationary pinned close to your ribs, curl the dumbbells upward toward shoulder level.',
      'Squeeze your biceps hard at the peak of the contraction for one full count.',
      'Lower the dumbbells slowly over 2-3 seconds back to full elbow extension.'
    ],
    formTips: [
      'Do not swing your torso or lean back to generate momentum; keep your shoulders relaxed down and back.',
      'Ensure full range of motion: lower all the way down without letting the dumbbells hang loosely.',
      'Keep your wrists straight and firm to prevent wrist joint discomfort.'
    ],
    beginnerVariation: 'Seated Alternating Dumbbell Curl, lifting one arm at a time to reduce fatigue and maintain strict form.',
    fitnessGoals: ['Muscle Gain', 'General Fitness'],
    durations: [15, 30, 45, 60],
    iconType: 'arm-curl'
  },
  {
    id: 'hammer-curl',
    name: 'Hammer Curl',
    category: 'Biceps',
    targetBodyPart: 'Biceps',
    musclesTargeted: 'Brachioradialis (Forearm), Brachialis, Biceps Brachii',
    requiredEquipment: 'Dumbbells',
    difficulty: 'Beginner',
    sets: '3 Sets',
    reps: '10 - 12 Reps',
    restDuration: '45 Seconds',
    instructions: [
      'Stand tall with your feet hip-width apart, holding dumbbells at your sides with palms facing inward toward each other (neutral grip).',
      'Lock your upper arms in place against your ribs, and curl the dumbbells up toward your shoulders.',
      'Hold the peak contraction for one second, feeling the work in your outer arms and forearms.',
      'Lower the dumbbells under control along the same path back to starting position.'
    ],
    formTips: [
      'Maintain the neutral hammer grip throughout the entire rep; do not twist your wrists.',
      'Keep your core braced so your lower body remains rock-steady.',
      'Avoid swinging the weights from behind your hips.'
    ],
    beginnerVariation: 'Alternating single-arm hammer curls or using filled water bottles for smooth initial conditioning.',
    fitnessGoals: ['Muscle Gain', 'Strength', 'General Fitness'],
    durations: [15, 30, 45, 60],
    iconType: 'arm-hammer'
  },

  // --------------------------------------------------------------------------
  // TRICEPS EXERCISES
  // --------------------------------------------------------------------------
  {
    id: 'dumbbell-overhead-extension',
    name: 'Dumbbell Overhead Extension',
    category: 'Triceps',
    targetBodyPart: 'Triceps',
    musclesTargeted: 'Triceps Brachii (Long Head & Lateral Head)',
    requiredEquipment: 'Dumbbells',
    difficulty: 'Intermediate',
    sets: '3 Sets',
    reps: '10 - 12 Reps',
    restDuration: '60 Seconds',
    instructions: [
      'Sit upright on a study chair or stand tall with feet shoulder-width apart.',
      'Hold a single dumbbell vertically overhead with both hands cup-gripping the underside of the top weight plate.',
      'Keeping your upper arms vertical and close to your ears, bend your elbows to lower the dumbbell behind your head.',
      'Lower until your elbows are bent at roughly 90 degrees, then extend through your triceps to press the weight back overhead.'
    ],
    formTips: [
      'Keep your elbows pointed forward and tucked in; do not allow them to flare widely outward.',
      'Keep your core braced so you do not hyperextend or arch your lower spine.',
      'Move only through the forearm hinge; keep upper arms steady.'
    ],
    beginnerVariation: 'Seated Two-Hand Extension using a very light dumbbell, or bodyweight Chair Tricep Dips.',
    fitnessGoals: ['Muscle Gain', 'Strength'],
    durations: [30, 45, 60],
    iconType: 'arm-tricep-overhead'
  },
  {
    id: 'dumbbell-kickback',
    name: 'Dumbbell Kickback',
    category: 'Triceps',
    targetBodyPart: 'Triceps',
    musclesTargeted: 'Triceps Brachii (Lateral & Medial Heads), Posterior Deltoid',
    requiredEquipment: 'Dumbbells',
    difficulty: 'Beginner',
    sets: '3 Sets',
    reps: '12 - 15 Reps / side',
    restDuration: '45 Seconds',
    instructions: [
      'Stand in a staggered stance and hinge forward 45 degrees at your hips, resting one hand on a chair or your knee.',
      'Hold a dumbbell in the other hand and pull your upper arm up so it is parallel to your torso, with your elbow bent at 90 degrees.',
      'Keeping your upper arm completely stationary, straighten your arm by pushing the dumbbell back and upward.',
      'Squeeze the tricep hard at full extension, then slowly return to the 90-degree bent position.'
    ],
    formTips: [
      'The upper arm must not drop or swing like a pendulum; keep it pinned high and parallel to the floor.',
      'Use a light weight so you can pause for a full second at lockout.',
      'Keep your neck neutral and your back straight.'
    ],
    beginnerVariation: 'Perform without weight focusing on isometric tricep contraction at peak lockout, or with a light water bottle.',
    fitnessGoals: ['Muscle Gain', 'General Fitness', 'Weight Management'],
    durations: [15, 30, 45, 60],
    iconType: 'arm-kickback'
  },

  // --------------------------------------------------------------------------
  // SHOULDERS EXERCISES
  // --------------------------------------------------------------------------
  {
    id: 'dumbbell-shoulder-press',
    name: 'Dumbbell Shoulder Press',
    category: 'Shoulders',
    targetBodyPart: 'Shoulders',
    musclesTargeted: 'Anterior & Lateral Deltoids, Triceps Brachii, Upper Trapezius',
    requiredEquipment: 'Dumbbells',
    difficulty: 'Beginner',
    sets: '3 - 4 Sets',
    reps: '8 - 12 Reps',
    restDuration: '60 Seconds',
    instructions: [
      'Sit upright on a sturdy chair or stand tall with feet shoulder-width apart.',
      'Hold the dumbbells at shoulder height with palms facing forward, elbows bent at 90 degrees.',
      'Press the weights straight upward in a smooth overhead path until your arms are fully extended over your crown.',
      'Lower the dumbbells slowly back to ear/shoulder level with complete control.'
    ],
    formTips: [
      'Do not arch your lower back to push the weight; keep your ribs pulled down and abs engaged.',
      'Do not clang the dumbbells together at the top.',
      'Exhale as you press up, inhale as you lower the weights down.'
    ],
    beginnerVariation: 'Seated Shoulder Press with back fully supported against a wall or chair backrest.',
    fitnessGoals: ['Muscle Gain', 'Strength', 'General Fitness'],
    durations: [15, 30, 45, 60],
    iconType: 'shoulder-press'
  },
  {
    id: 'lateral-raise',
    name: 'Lateral Raise',
    category: 'Shoulders',
    targetBodyPart: 'Shoulders',
    musclesTargeted: 'Lateral Deltoids (Side Shoulders), Supraspinatus, Trapezius',
    requiredEquipment: 'Dumbbells',
    difficulty: 'Beginner',
    sets: '3 - 4 Sets',
    reps: '12 - 15 Reps',
    restDuration: '45 Seconds',
    instructions: [
      'Stand with feet shoulder-width apart holding light dumbbells in front of your thighs, palms facing inward.',
      'With a slight bend in your elbows and a slight forward lean from the hips (5 degrees), raise the weights out to your sides.',
      'Lift until your arms are parallel to the floor (shoulder height), leading slightly with your elbows.',
      'Pause for a fraction of a second, then lower the weights smoothly back to starting position over 2 seconds.'
    ],
    formTips: [
      'Do not shrug your neck or use body English/momentum to fling the weights up.',
      'Keep your thumbs slightly lower than or level with your pinkies (like pouring water).',
      'Always prioritize light, strict weight over heavy weights that compromise form.'
    ],
    beginnerVariation: 'Bent-Arm Lateral Raises (keeping elbows bent at 90 degrees) which reduces the lever arm and shoulder joint torque.',
    fitnessGoals: ['Muscle Gain', 'General Fitness'],
    durations: [15, 30, 45, 60],
    iconType: 'shoulder-lateral'
  },
  {
    id: 'front-raise',
    name: 'Front Raise',
    category: 'Shoulders',
    targetBodyPart: 'Shoulders',
    musclesTargeted: 'Anterior Deltoids (Front Shoulders), Clavicular Pectoral Head',
    requiredEquipment: 'Dumbbells',
    difficulty: 'Beginner',
    sets: '3 Sets',
    reps: '12 - 15 Reps',
    restDuration: '45 Seconds',
    instructions: [
      'Stand tall holding dumbbells across the front of your thighs with an overhand grip (palms facing your body).',
      'Keeping your torso stationary and arms nearly straight with a soft elbow micro-bend, lift the weights directly in front of you.',
      'Raise the dumbbells up to shoulder height, pause briefly to feel the front deltoid tension.',
      'Slowly lower the dumbbells back down along the same path under full muscular control.'
    ],
    formTips: [
      'Do not lean backward or rock your hips as you lift the dumbbells.',
      'Keep your wrists straight and firm; do not flex your wrists upward.',
      'Can be performed with both arms together or alternating single arms.'
    ],
    beginnerVariation: 'Alternating Single-Arm Front Raise or holding a single dumbbell with both hands.',
    fitnessGoals: ['Muscle Gain', 'General Fitness'],
    durations: [15, 30, 45, 60],
    iconType: 'shoulder-front'
  },

  // --------------------------------------------------------------------------
  // ABS & CORE EXERCISES
  // --------------------------------------------------------------------------
  {
    id: 'crunches',
    name: 'Crunches',
    category: 'Abs',
    targetBodyPart: 'Abs',
    musclesTargeted: 'Rectus Abdominis (Upper Abs), Obliques',
    requiredEquipment: 'No Equipment',
    difficulty: 'Beginner',
    sets: '3 Sets',
    reps: '15 - 20 Reps',
    restDuration: '45 Seconds',
    instructions: [
      'Lie on your back on a mat with your knees bent and feet flat on the floor, about hip-width apart.',
      'Place your hands lightly behind your head with elbows wide, or cross your arms over your chest.',
      'Engage your abdominal wall and curl your head, neck, and shoulder blades off the floor towards your knees.',
      'Exhale forcefully at the top, hold for one count, then slowly lower your shoulder blades back down.'
    ],
    formTips: [
      'Never yank or pull on your neck with your hands; keep a fist-sized gap between your chin and your chest.',
      'Keep your lower back pressed firmly into the floor throughout the entire movement.',
      'Focus on contracting your ribs toward your pelvis rather than sitting all the way up.'
    ],
    beginnerVariation: 'Slide Crunches with hands resting on thighs, sliding your fingertips toward your kneecaps.',
    fitnessGoals: ['General Fitness', 'Weight Management', 'Strength'],
    durations: [15, 30, 45, 60],
    iconType: 'core-crunch'
  },
  {
    id: 'leg-raises',
    name: 'Leg Raises',
    category: 'Abs',
    targetBodyPart: 'Abs',
    musclesTargeted: 'Lower Rectus Abdominis, Hip Flexors, Transverse Abdominis',
    requiredEquipment: 'No Equipment',
    difficulty: 'Intermediate',
    sets: '3 Sets',
    reps: '10 - 12 Reps',
    restDuration: '45 Seconds',
    instructions: [
      'Lie flat on your back on a mat with your legs extended straight and hands placed flat beside your hips (or slightly under your glutes for lumbar support).',
      'Press your lower back flat against the floor to eliminate any arch.',
      'Keeping your legs as straight as possible, raise them together until they form a 90-degree angle with your torso.',
      'Slowly lower your legs back down toward the floor, stopping 2 inches above the ground before repeating.'
    ],
    formTips: [
      'If your lower back begins to arch off the floor as your legs descend, stop and lift them back up immediately.',
      'Inhale as your legs lower, and exhale as you lift them back up.',
      'Move slowly and deliberately; do not swing your legs or use momentum.'
    ],
    beginnerVariation: 'Bent-Knee Reverse Crunches or Alternating Single-Leg Raises with knees bent at 90 degrees.',
    fitnessGoals: ['Strength', 'Muscle Gain', 'General Fitness'],
    durations: [15, 30, 45, 60],
    iconType: 'core-leg-raise'
  },
  {
    id: 'plank',
    name: 'Plank',
    category: 'Abs',
    targetBodyPart: 'Abs',
    musclesTargeted: 'Transverse Abdominis, Rectus Abdominis, Glutes, Deltoids, Spine Stabilizers',
    requiredEquipment: 'No Equipment',
    difficulty: 'Beginner',
    sets: '3 Sets',
    reps: '30 - 60 Seconds',
    restDuration: '45 Seconds',
    instructions: [
      'Place your forearms on the floor with elbows directly aligned under your shoulders, hands facing forward.',
      'Extend your legs straight back with toes tucked, rising up onto your forearms and toes.',
      'Create a rigid plank from the crown of your head through your spine, hips, and heels.',
      'Actively pull your belly button towards your spine, squeeze your glutes, and breathe steadily.'
    ],
    formTips: [
      'Do not allow your hips to sag toward the floor (strains lower back) or pike high in the air.',
      'Keep your neck neutral by gazing down at your hands.',
      'Actively press the floor away through your forearms to engage your serratus anterior.'
    ],
    beginnerVariation: 'Kneeling Forearm Plank or Elevated Plank with hands placed on a bed frame or study desk.',
    fitnessGoals: ['General Fitness', 'Strength', 'Weight Management'],
    durations: [15, 30, 45, 60],
    iconType: 'core-plank'
  },

  // --------------------------------------------------------------------------
  // LEGS EXERCISES
  // --------------------------------------------------------------------------
  {
    id: 'bodyweight-squats',
    name: 'Bodyweight Squats',
    category: 'Legs',
    targetBodyPart: 'Legs',
    musclesTargeted: 'Quadriceps, Gluteus Maximus, Hamstrings, Core, Calves',
    requiredEquipment: 'No Equipment',
    difficulty: 'Beginner',
    sets: '3 - 4 Sets',
    reps: '15 - 20 Reps',
    restDuration: '60 Seconds',
    instructions: [
      'Stand with your feet slightly wider than shoulder-width apart, toes pointed slightly outward (15-20 degrees).',
      'Extend your arms in front of your chest for balance and keep your chest lifted with a neutral spine.',
      'Initiate the movement by sending your hips back and bending your knees, as if sitting down into a chair.',
      'Lower down until your thighs are at least parallel to the floor, then drive through your heels to stand back up tall.'
    ],
    formTips: [
      'Keep your knees tracking in line with your middle toes; never let them cave inward.',
      'Keep your whole foot planted with weight distributed through the midfoot and heel.',
      'Breathe in as you squat down, exhale as you power up.'
    ],
    beginnerVariation: 'Box / Chair Squats: Squatting onto a study chair, pausing lightly, and driving up to build knee confidence.',
    fitnessGoals: ['General Fitness', 'Weight Management', 'Muscle Gain', 'Strength'],
    durations: [15, 30, 45, 60],
    iconType: 'leg-squat'
  },
  {
    id: 'goblet-squats',
    name: 'Goblet Squats',
    category: 'Legs',
    targetBodyPart: 'Legs',
    musclesTargeted: 'Quadriceps, Gluteus Maximus, Adductors, Core, Upper Back',
    requiredEquipment: 'Dumbbells',
    difficulty: 'Intermediate',
    sets: '3 - 4 Sets',
    reps: '10 - 12 Reps',
    restDuration: '60 Seconds',
    instructions: [
      'Stand tall holding a single dumbbell vertically against your chest with both hands cradling the top weight plate.',
      'Set your feet shoulder-width apart with toes angled slightly outward.',
      'Hinge at your hips and bend your knees to squat down, keeping your torso upright and elbows tucked between your knees at the bottom.',
      'Descend to parallel, then press firmly through your heels to return to standing, squeezing your glutes at the top.'
    ],
    formTips: [
      'The dumbbell held at chest level naturally reinforces an upright chest posture; do not let it pull you forward.',
      'Keep your heels firmly on the ground at all times.',
      'Avoid bouncing out of the hole at the bottom.'
    ],
    beginnerVariation: 'Bodyweight Squat holding hands clasped at your chest, or using a light dumbbell.',
    fitnessGoals: ['Muscle Gain', 'Strength', 'Weight Management'],
    durations: [30, 45, 60],
    iconType: 'leg-goblet'
  },
  {
    id: 'lunges',
    name: 'Lunges',
    category: 'Legs',
    targetBodyPart: 'Legs',
    musclesTargeted: 'Quadriceps, Gluteus Maximus, Hamstrings, Calves, Core Stabilizers',
    requiredEquipment: 'No Equipment',
    difficulty: 'Beginner',
    sets: '3 Sets',
    reps: '10 - 12 Reps / leg',
    restDuration: '60 Seconds',
    instructions: [
      'Stand upright with your hands on your hips and feet hip-width apart.',
      'Take a controlled, generous step backward (or forward) with one leg, keeping your torso upright.',
      'Lower your hips until both your front and back knees form approximate 90-degree angles.',
      'Your back knee should hover about an inch above the floor. Push through your front heel to return to the starting position.'
    ],
    formTips: [
      'Reverse lunges (stepping backward) are significantly gentler on the front patellar tendon than forward lunges.',
      'Keep your front knee directly above your front ankle, not jutting far past your toes.',
      'Maintain an upright posture without leaning forward over your front thigh.'
    ],
    beginnerVariation: 'Static Split Squat: Keep both feet planted in place and simply drop and rise, holding a wall or desk for balance.',
    fitnessGoals: ['General Fitness', 'Weight Management', 'Muscle Gain', 'Strength'],
    durations: [15, 30, 45, 60],
    iconType: 'leg-lunge'
  },
  {
    id: 'calf-raises',
    name: 'Calf Raises',
    category: 'Legs',
    targetBodyPart: 'Legs',
    musclesTargeted: 'Gastrocnemius, Soleus, Tibialis Posterior',
    requiredEquipment: 'No Equipment',
    difficulty: 'Beginner',
    sets: '3 - 4 Sets',
    reps: '15 - 25 Reps',
    restDuration: '45 Seconds',
    instructions: [
      'Stand tall with your feet hip-width apart, holding onto a wall, chair, or desk for light balance.',
      'Slowly press up through the balls of both feet, lifting your heels as high as possible off the ground.',
      'Hold the peak contraction at the top for one full second, feeling your calf muscles tighten.',
      'Lower your heels back down smoothly over 2 seconds until they gently brush the floor.'
    ],
    formTips: [
      'Do not bounce rapidly up and down; the achilles tendon will do the work instead of your calf muscles.',
      'Push evenly across the balls of your feet, especially through your big toes.',
      'For greater range of motion, stand with balls of your feet on the edge of a thick book or step.'
    ],
    beginnerVariation: 'Two-foot calf raise on flat floor holding firmly onto a wall with both hands.',
    fitnessGoals: ['General Fitness', 'Strength'],
    durations: [15, 30, 45, 60],
    iconType: 'leg-calf'
  },

  // --------------------------------------------------------------------------
  // WARM-UP EXERCISES
  // --------------------------------------------------------------------------
  {
    id: 'dynamic-arm-circles',
    name: 'Dynamic Arm Circles & Chest Openers',
    category: 'Warm-up',
    targetBodyPart: 'Warm-up',
    musclesTargeted: 'Rotator Cuff, Deltoids, Pectorals, Upper Trapezius',
    requiredEquipment: 'No Equipment',
    difficulty: 'Beginner',
    sets: '2 Sets',
    reps: '30 - 45 Seconds',
    restDuration: '15 Seconds',
    instructions: [
      'Stand with feet shoulder-width apart and extend your arms straight out to the sides at shoulder height.',
      'Begin making small forward circular motions, gradually increasing the circle diameter over 15 seconds.',
      'Reverse directions and make backward circles for 15 seconds.',
      'Finish by swinging your arms across your chest in an open-hug motion, alternating which arm crosses on top.'
    ],
    formTips: [
      'Keep your shoulders relaxed away from your ears; do not shrug.',
      'Maintain an upright posture and breathe smoothly.',
      'Warm up the synovial fluid in the shoulder capsules before pressing movements.'
    ],
    beginnerVariation: 'Gentle shoulder rolls and seated arm reach-and-pulls.',
    fitnessGoals: ['General Fitness', 'Muscle Gain', 'Strength', 'Weight Management'],
    durations: [15, 30, 45, 60],
    iconType: 'warmup-arms'
  },
  {
    id: 'cat-cow-spine-flow',
    name: 'Cat-Cow Spine Mobility',
    category: 'Warm-up',
    targetBodyPart: 'Warm-up',
    musclesTargeted: 'Erector Spinae, Latissimus Dorsi, Cervical Spine, Abdominal Wall',
    requiredEquipment: 'No Equipment',
    difficulty: 'Beginner',
    sets: '2 Sets',
    reps: '10 Slow Breaths',
    restDuration: '15 Seconds',
    instructions: [
      'Begin on all fours on a soft mat, with your wrists directly under your shoulders and knees under your hips.',
      'Inhale as you arch your spine downward (Cow Pose), lifting your chest and tailbone upward.',
      'Exhale as you round your spine toward the ceiling (Cat Pose), tucking your chin to your chest and tucking your pelvis.',
      'Flow smoothly between both postures in synchronization with your deep breathing.'
    ],
    formTips: [
      'Move gently without forcing end-range spinal compression.',
      'Great for decompressing the spine after hours of desk or study work.',
      'Keep your fingers spread wide to distribute wrist pressure.'
    ],
    beginnerVariation: 'Seated Cat-Cow on a chair: placing hands on knees, arching and rounding the back.',
    fitnessGoals: ['General Fitness', 'Strength', 'Weight Management'],
    durations: [15, 30, 45, 60],
    iconType: 'warmup-spine'
  },
  {
    id: 'jumping-jacks-hip-openers',
    name: 'Jumping Jacks & Hip Openers',
    category: 'Warm-up',
    targetBodyPart: 'Warm-up',
    musclesTargeted: 'Calves, Deltoids, Hip Abductors, Core, Aerobic Priming',
    requiredEquipment: 'No Equipment',
    difficulty: 'Beginner',
    sets: '2 Sets',
    reps: '45 Seconds',
    restDuration: '20 Seconds',
    instructions: [
      'Stand upright with your feet together and arms hanging by your sides.',
      'Jump your feet out to the sides while raising your arms above your head in a smooth overhead clap.',
      'Immediately jump your feet back together while lowering your arms back to your sides.',
      'Transition into 15 seconds of standing hip circles to lubricate hip joints.'
    ],
    formTips: [
      'Land softly on the balls of your feet to minimize impact sound in hostel or apartment rooms.',
      'Keep a slight bend in your knees throughout.',
      'Maintain an even, rhythmic breathing tempo.'
    ],
    beginnerVariation: 'Step Jacks: Stepping one foot out to the side at a time while raising arms, eliminating jumping impact.',
    fitnessGoals: ['Weight Management', 'General Fitness', 'Muscle Gain', 'Strength'],
    durations: [15, 30, 45, 60],
    iconType: 'warmup-jacks'
  },

  // --------------------------------------------------------------------------
  // FULL BODY CIRCUIT EXERCISES
  // --------------------------------------------------------------------------
  {
    id: 'hostel-calisthenics-circuit',
    name: 'Hostel Calisthenics Circuit',
    category: 'Full Body Circuit',
    targetBodyPart: 'Full Body',
    musclesTargeted: 'Pectorals, Quadriceps, Core, Deltoids, Hamstrings',
    requiredEquipment: 'No Equipment',
    difficulty: 'Intermediate',
    sets: '3 - 4 Rounds',
    reps: '45 Seconds / Station',
    restDuration: '60 Seconds between rounds',
    instructions: [
      'Station 1: 45 seconds of controlled Bodyweight Squats.',
      'Station 2: 45 seconds of Push-ups or Incline Desk Push-ups.',
      'Station 3: 45 seconds of Forearm Plank hold.',
      'Station 4: 45 seconds of Alternating Reverse Lunges. Rest 60 seconds after completing all four stations.'
    ],
    formTips: [
      'Maintain steady pacing; do not sprint the first 15 seconds and burn out.',
      'Prioritize clean form over frantic repetition count.',
      'Stay hydrated with sips of water between rounds.'
    ],
    beginnerVariation: '30 seconds work / 30 seconds rest per station using knee push-ups and chair squats.',
    fitnessGoals: ['Weight Management', 'General Fitness', 'Strength'],
    durations: [15, 30, 45, 60],
    iconType: 'circuit-flow'
  },
  {
    id: 'dumbbell-thruster',
    name: 'Dumbbell Thruster',
    category: 'Full Body Circuit',
    targetBodyPart: 'Full Body',
    musclesTargeted: 'Quadriceps, Glutes, Anterior Deltoids, Triceps, Core',
    requiredEquipment: 'Dumbbells',
    difficulty: 'Intermediate',
    sets: '3 - 4 Sets',
    reps: '8 - 12 Reps',
    restDuration: '60 Seconds',
    instructions: [
      'Hold dumbbells at shoulder height with palms facing each other, feet shoulder-width apart.',
      'Lower down into a full squat until your thighs reach parallel to the floor.',
      'Drive aggressively upward through your heels, using the momentum of your standing hips to press the dumbbells overhead.',
      'Lock out overhead with arms aligned, then lower the dumbbells back to shoulders as you descend smoothly into the next squat.'
    ],
    formTips: [
      'This is one fluid compound movement: transfer power from your legs directly into the overhead press.',
      'Do not press before your hips have initiated the upward drive.',
      'Keep your chest high and core braced throughout.'
    ],
    beginnerVariation: 'Bodyweight Squats to overhead reach without dumbbells, or using light dumbbells.',
    fitnessGoals: ['Weight Management', 'Muscle Gain', 'Strength'],
    durations: [30, 45, 60],
    iconType: 'circuit-thruster'
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    category: 'Full Body Circuit',
    targetBodyPart: 'Full Body',
    musclesTargeted: 'Rectus Abdominis, Hip Flexors, Deltoids, Calves, Cardiovascular System',
    requiredEquipment: 'No Equipment',
    difficulty: 'Beginner',
    sets: '3 Sets',
    reps: '30 - 45 Seconds',
    restDuration: '30 Seconds',
    instructions: [
      'Start in a push-up high plank position with your hands directly under your shoulders, core braced.',
      'Quickly drive your right knee in toward your chest without touching the floor with your right toes.',
      'Step the right foot back while simultaneously driving your left knee toward your chest in a running motion.',
      'Continue alternating legs at a steady, rhythmic pace while keeping your hips level.'
    ],
    formTips: [
      'Keep your hips low and parallel to the floor; do not bounce your buttocks high into the air.',
      'Keep your shoulders positioned firmly over your wrists.',
      'Focus on smooth breathing and steady knee drives.'
    ],
    beginnerVariation: 'Incline Mountain Climbers with hands elevated on a bed frame, study desk, or bench.',
    fitnessGoals: ['Weight Management', 'General Fitness', 'Strength'],
    durations: [15, 30, 45, 60],
    iconType: 'circuit-climber'
  }
];

/**
 * Returns a clean, high-contrast SVG diagram illustrating the exercise movement.
 * Built with pure inline SVGs conforming to FitBuddy's lime-accent & dark-forest visual design.
 * @param {string} iconType 
 * @returns {string} SVG HTML string
 */
function getExerciseSvgIllustration(iconType) {
  const lime = '#B9F36A';
  const forest = '#17251F';
  const subtle = '#D1D8CE';
  const bgSubtle = '#EEF2EB';

  switch (iconType) {
    case 'chest-push':
      return `
        <svg viewBox="0 0 160 110" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Push-up Exercise Mechanics">
          <!-- Floor Line -->
          <line x1="15" y1="92" x2="145" y2="92" stroke="${subtle}" stroke-width="2.5" stroke-dasharray="4 4" />
          <!-- Human Figure in Push-up Plank Position -->
          <!-- Feet on ground -->
          <circle cx="28" cy="88" r="4" fill="${forest}" />
          <!-- Body plank diagonal line -->
          <line x1="28" y1="88" x2="110" y2="52" stroke="${forest}" stroke-width="4.5" stroke-linecap="round" />
          <!-- Head -->
          <circle cx="124" cy="46" r="8" fill="${forest}" />
          <!-- Primary Active Chest Highlight Area -->
          <ellipse cx="98" cy="56" rx="9" ry="6" fill="${lime}" fill-opacity="0.9" />
          <!-- Arm pressing down to floor -->
          <polyline points="98,58 102,74 102,90" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
          <!-- Hand on floor -->
          <line x1="96" y1="90" x2="108" y2="90" stroke="${forest}" stroke-width="3" stroke-linecap="round" />
          <!-- Motion Indicator Arrows -->
          <path d="M106 40 L106 32 M102 36 L106 32 L110 36" stroke="${forest}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M106 66 L106 74 M102 70 L106 74 L110 70" stroke="${forest}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      `;

    case 'chest-press':
    case 'chest-fly':
      return `
        <svg viewBox="0 0 160 110" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Floor Press Exercise Mechanics">
          <!-- Floor Surface -->
          <line x1="15" y1="88" x2="145" y2="88" stroke="${subtle}" stroke-width="2.5" />
          <!-- Torso flat on floor -->
          <line x1="40" y1="82" x2="105" y2="82" stroke="${forest}" stroke-width="5" stroke-linecap="round" />
          <!-- Head -->
          <circle cx="30" cy="80" r="7" fill="${forest}" />
          <!-- Bent Knees on floor -->
          <polyline points="105,82 120,60 135,88" stroke="${forest}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
          <!-- Chest Active Highlight -->
          <circle cx="65" cy="78" r="8" fill="${lime}" />
          <!-- Arms holding dumbbells upward -->
          <line x1="65" y1="80" x2="65" y2="38" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" />
          <!-- Dumbbell Graphic -->
          <rect x="52" y="34" width="26" height="6" rx="2" fill="${forest}" />
          <rect x="50" y="30" width="6" height="14" rx="2" fill="${forest}" />
          <rect x="74" y="30" width="6" height="14" rx="2" fill="${forest}" />
          <!-- Motion Arrows -->
          <path d="M78 54 L78 44 M75 48 L78 44 L81 48" stroke="${forest}" stroke-width="2" stroke-linecap="round" />
        </svg>
      `;

    case 'back-row':
    case 'back-pullover':
      return `
        <svg viewBox="0 0 160 110" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Dumbbell Row Exercise Mechanics">
          <!-- Support Bench / Chair -->
          <line x1="20" y1="78" x2="65" y2="78" stroke="${subtle}" stroke-width="4" />
          <line x1="30" y1="78" x2="30" y2="95" stroke="${subtle}" stroke-width="3" />
          <!-- Hinging Torso -->
          <line x1="50" y1="52" x2="105" y2="52" stroke="${forest}" stroke-width="5" stroke-linecap="round" />
          <!-- Back Lats Highlight -->
          <ellipse cx="80" cy="50" rx="14" ry="7" fill="${lime}" fill-opacity="0.95" />
          <!-- Head -->
          <circle cx="40" cy="48" r="7" fill="${forest}" />
          <!-- Legs -->
          <polyline points="105,52 115,75 125,95" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
          <!-- Arm pulling dumbbell up to hip -->
          <polyline points="78,52 88,40 88,68" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
          <!-- Dumbbell -->
          <rect x="80" y="66" width="16" height="5" rx="1" fill="${forest}" />
          <rect x="78" y="62" width="4" height="13" rx="1" fill="${forest}" />
          <rect x="94" y="62" width="4" height="13" rx="1" fill="${forest}" />
          <!-- Pull Vector Arrow -->
          <path d="M96 68 L96 46 M92 50 L96 46 L100 50" stroke="${forest}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      `;

    case 'arm-curl':
    case 'arm-hammer':
      return `
        <svg viewBox="0 0 160 110" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Biceps Curl Exercise Mechanics">
          <!-- Upper Body Torso -->
          <line x1="70" y1="36" x2="70" y2="90" stroke="${forest}" stroke-width="5" stroke-linecap="round" />
          <!-- Head -->
          <circle cx="70" cy="22" r="8" fill="${forest}" />
          <!-- Upper Arm pinned to torso -->
          <line x1="70" y1="38" x2="70" y2="65" stroke="${forest}" stroke-width="4" stroke-linecap="round" />
          <!-- Biceps Active Muscle Highlight -->
          <ellipse cx="73" cy="54" rx="7" ry="5" fill="${lime}" />
          <!-- Forearm curling upward -->
          <line x1="70" y1="65" x2="88" y2="45" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" />
          <!-- Dumbbell in hand -->
          <circle cx="88" cy="43" r="5" fill="${forest}" />
          <line x1="82" y1="41" x2="94" y2="41" stroke="${forest}" stroke-width="4" stroke-linecap="round" />
          <!-- Arc of movement -->
          <path d="M85 70 A 20 20 0 0 0 92 48" stroke="${forest}" stroke-width="1.8" stroke-dasharray="3 3" />
          <polygon points="90,44 95,49 90,52" fill="${forest}" />
        </svg>
      `;

    case 'arm-tricep-overhead':
    case 'arm-kickback':
      return `
        <svg viewBox="0 0 160 110" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Triceps Exercise Mechanics">
          <!-- Torso -->
          <line x1="75" y1="40" x2="75" y2="95" stroke="${forest}" stroke-width="5" stroke-linecap="round" />
          <!-- Head -->
          <circle cx="75" cy="24" r="8" fill="${forest}" />
          <!-- Upper Arm overhead -->
          <line x1="75" y1="40" x2="75" y2="15" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" />
          <!-- Triceps Muscle Highlight (Back of arm) -->
          <ellipse cx="70" cy="26" rx="5" ry="8" fill="${lime}" />
          <!-- Forearm bent down behind head -->
          <line x1="75" y1="15" x2="60" y2="35" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" />
          <!-- Dumbbell behind head -->
          <rect x="52" y="32" width="16" height="6" rx="2" fill="${forest}" />
          <!-- Extension Arrow -->
          <path d="M60 30 Q 64 12 73 14" stroke="${forest}" stroke-width="2" stroke-linecap="round" fill="none" />
          <polygon points="74,10 78,16 71,16" fill="${forest}" />
        </svg>
      `;

    case 'shoulder-press':
    case 'shoulder-lateral':
    case 'shoulder-front':
      return `
        <svg viewBox="0 0 160 110" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Shoulder Exercise Mechanics">
          <!-- Torso and Head -->
          <line x1="80" y1="42" x2="80" y2="95" stroke="${forest}" stroke-width="5" stroke-linecap="round" />
          <circle cx="80" cy="24" r="8" fill="${forest}" />
          <!-- Shoulder Caps Highlight -->
          <circle cx="66" cy="42" r="7" fill="${lime}" />
          <circle cx="94" cy="42" r="7" fill="${lime}" />
          <!-- Left and Right Arms Raising Weights -->
          <polyline points="80,42 60,42 45,35" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
          <polyline points="80,42 100,42 115,35" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
          <!-- Dumbbells on both ends -->
          <rect x="38" y="30" width="8" height="10" rx="2" fill="${forest}" />
          <rect x="114" y="30" width="8" height="10" rx="2" fill="${forest}" />
          <!-- Elevation Arrows -->
          <path d="M42 50 L42 38 M39 42 L42 38 L45 42" stroke="${forest}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M118 50 L118 38 M115 42 L118 38 L121 42" stroke="${forest}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      `;

    case 'core-crunch':
    case 'core-leg-raise':
    case 'core-plank':
      return `
        <svg viewBox="0 0 160 110" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Core Abdominal Exercise Mechanics">
          <!-- Ground Surface -->
          <line x1="20" y1="88" x2="140" y2="88" stroke="${subtle}" stroke-width="2.5" />
          <!-- Body in Plank or Crunch Curve -->
          <ellipse cx="78" cy="62" rx="15" ry="8" fill="${lime}" fill-opacity="0.9" />
          <path d="M35 78 C 50 60, 95 60, 120 78" stroke="${forest}" stroke-width="4.5" fill="none" stroke-linecap="round" />
          <!-- Head -->
          <circle cx="32" cy="74" r="7" fill="${forest}" />
          <!-- Legs extended -->
          <line x1="120" y1="78" x2="135" y2="88" stroke="${forest}" stroke-width="4" stroke-linecap="round" />
          <!-- Core Center Symbol -->
          <circle cx="78" cy="62" r="3" fill="${forest}" />
          <!-- Core Tension Rings -->
          <path d="M68 55 Q 78 50 88 55" stroke="${forest}" stroke-width="2" stroke-linecap="round" fill="none" />
          <path d="M68 69 Q 78 74 88 69" stroke="${forest}" stroke-width="2" stroke-linecap="round" fill="none" />
        </svg>
      `;

    case 'leg-squat':
    case 'leg-goblet':
    case 'leg-lunge':
    case 'leg-calf':
      return `
        <svg viewBox="0 0 160 110" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Leg Squat Exercise Mechanics">
          <!-- Ground Line -->
          <line x1="20" y1="94" x2="140" y2="94" stroke="${subtle}" stroke-width="2.5" />
          <!-- Torso in Squat -->
          <line x1="68" y1="36" x2="60" y2="60" stroke="${forest}" stroke-width="4.5" stroke-linecap="round" />
          <circle cx="72" cy="24" r="8" fill="${forest}" />
          <!-- Quadriceps Active Muscle Highlight -->
          <ellipse cx="80" cy="60" rx="14" ry="7" fill="${lime}" />
          <!-- Thigh parallel to floor -->
          <line x1="60" y1="60" x2="95" y2="60" stroke="${forest}" stroke-width="4.5" stroke-linecap="round" />
          <!-- Shin / Calf down to floor -->
          <line x1="95" y1="60" x2="90" y2="94" stroke="${forest}" stroke-width="4.5" stroke-linecap="round" />
          <line x1="85" y1="94" x2="100" y2="94" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" />
          <!-- Power Drive Vector Arrow -->
          <path d="M68 52 L68 38 M64 42 L68 38 L72 42" stroke="${forest}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      `;

    default: // Warm-up & Full Body Circuit
      return `
        <svg viewBox="0 0 160 110" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Full Body Circuit Movement">
          <!-- Ground Line -->
          <line x1="20" y1="92" x2="140" y2="92" stroke="${subtle}" stroke-width="2.5" stroke-dasharray="3 3" />
          <!-- Athletic Dynamic Pose -->
          <circle cx="80" cy="26" r="8" fill="${forest}" />
          <!-- Full Body Power Highlight in Center -->
          <circle cx="80" cy="52" r="16" fill="${lime}" fill-opacity="0.8" />
          <!-- Torso -->
          <line x1="80" y1="34" x2="80" y2="65" stroke="${forest}" stroke-width="4.5" stroke-linecap="round" />
          <!-- Dynamic Arms -->
          <polyline points="50,30 80,42 110,30" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
          <!-- Dynamic Legs in Movement -->
          <polyline points="60,92 72,74 80,65 88,74 100,92" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
          <!-- Motion Sparkle Energy -->
          <polygon points="80,48 83,54 89,55 84,59 86,65 80,61 74,65 76,59 71,55 77,54" fill="${forest}" />
        </svg>
      `;
  }
}

/**
 * Returns an animated inline SVG for the 5 key exercises (Dumbbell Curl, Push-up,
 * Bodyweight Squat, Shoulder Press, Plank) using CSS keyframe animations,
 * or returns a static educational illustration placeholder for all other exercises.
 * @param {string} exerciseId 
 * @returns {string} SVG HTML string with animation classes
 */
function getExerciseMovementAnimation(exerciseId) {
  const lime = '#B9F36A';
  const forest = '#17251F';
  const subtle = '#D1D8CE';

  const normalizedId = (exerciseId || '').toLowerCase().trim();

  // 1. PUSH-UP ANIMATION
  if (normalizedId === 'push-ups' || normalizedId === 'push-up') {
    return `
      <div class="exercise-anim-wrap">
        <svg viewBox="0 0 160 110" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Push-up exercise animation demonstration">
          <!-- Floor Line -->
          <line x1="15" y1="90" x2="145" y2="90" stroke="${subtle}" stroke-width="2.5" stroke-dasharray="4 4" />
          <!-- Fixed Hands on floor -->
          <line x1="98" y1="90" x2="110" y2="90" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" />
          <!-- Fixed Toes pivot on floor -->
          <circle cx="28" cy="90" r="4.5" fill="${forest}" />

          <!-- Animated Upper Body (Pivots up and down) -->
          <g class="anim-pushup-body">
            <!-- Straight Plank Spine -->
            <line x1="28" y1="90" x2="105" y2="52" stroke="${forest}" stroke-width="4.5" stroke-linecap="round" />
            <!-- Head -->
            <circle cx="118" cy="46" r="8" fill="${forest}" />
            <!-- Active Pectoral Highlight -->
            <ellipse cx="94" cy="56" rx="9" ry="6" fill="${lime}" fill-opacity="0.95" />
            <!-- Arm pressing from shoulder to hand -->
            <polyline points="94,56 104,72 104,90" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
          </g>

          <!-- Label naming the exercise -->
          <text x="80" y="105" text-anchor="middle" class="exercise-anim-label">Push-up (Upper Body Motion)</text>
        </svg>
      </div>
    `;
  }

  // 2. DUMBBELL CURL ANIMATION
  if (normalizedId === 'dumbbell-curl' || normalizedId === 'bicep-curl') {
    return `
      <div class="exercise-anim-wrap">
        <svg viewBox="0 0 160 110" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dumbbell curl exercise animation demonstration">
          <!-- Torso and Head -->
          <line x1="68" y1="36" x2="68" y2="92" stroke="${forest}" stroke-width="5" stroke-linecap="round" />
          <circle cx="68" cy="22" r="8" fill="${forest}" />
          <!-- Fixed Upper Arm pinned to ribcage -->
          <line x1="68" y1="38" x2="70" y2="65" stroke="${forest}" stroke-width="4" stroke-linecap="round" />
          <!-- Bicep Active Muscle Peak -->
          <ellipse cx="73" cy="53" rx="7" ry="5" fill="${lime}" />

          <!-- Animated Forearm + Dumbbell (Curling up to shoulder) -->
          <g class="anim-curl-forearm">
            <!-- Forearm -->
            <line x1="70" y1="65" x2="70" y2="90" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" />
            <!-- Dumbbell in hand -->
            <circle cx="70" cy="90" r="4.5" fill="${forest}" />
            <line x1="62" y1="90" x2="78" y2="90" stroke="${forest}" stroke-width="4" stroke-linecap="round" />
            <rect x="58" y="86" width="4" height="8" rx="1" fill="${forest}" />
            <rect x="78" y="86" width="4" height="8" rx="1" fill="${forest}" />
          </g>

          <!-- Label naming the exercise -->
          <text x="80" y="105" text-anchor="middle" class="exercise-anim-label">Dumbbell Curl (Forearm Flexion)</text>
        </svg>
      </div>
    `;
  }

  // 3. BODYWEIGHT SQUAT ANIMATION
  if (normalizedId === 'bodyweight-squats' || normalizedId === 'bodyweight-squat' || normalizedId === 'squats' || normalizedId === 'goblet-squats') {
    return `
      <div class="exercise-anim-wrap">
        <svg viewBox="0 0 160 110" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bodyweight squat exercise animation demonstration">
          <!-- Floor line -->
          <line x1="20" y1="94" x2="140" y2="94" stroke="${subtle}" stroke-width="2.5" />
          <!-- Planted Lower Shins & Feet -->
          <line x1="88" y1="78" x2="88" y2="94" stroke="${forest}" stroke-width="4.5" stroke-linecap="round" />
          <line x1="82" y1="94" x2="96" y2="94" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" />

          <!-- Animated Torso and Thighs (Descends into squat) -->
          <g class="anim-squat-torso">
            <!-- Head -->
            <circle cx="74" cy="24" r="8" fill="${forest}" />
            <!-- Torso -->
            <line x1="74" y1="34" x2="65" y2="60" stroke="${forest}" stroke-width="4.5" stroke-linecap="round" />
            <!-- Arms extended forward for balance -->
            <line x1="72" y1="40" x2="98" y2="40" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" />
            <!-- Active Quadriceps Highlight -->
            <ellipse cx="78" cy="68" rx="12" ry="6" fill="${lime}" />
            <!-- Thigh hinge -->
            <polyline points="65,60 88,68 88,78" stroke="${forest}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
          </g>

          <!-- Label naming the exercise -->
          <text x="80" y="105" text-anchor="middle" class="exercise-anim-label">Squat (Hip & Knee Drive)</text>
        </svg>
      </div>
    `;
  }

  // 4. DUMBBELL SHOULDER PRESS ANIMATION
  if (normalizedId === 'dumbbell-shoulder-press' || normalizedId === 'shoulder-press') {
    return `
      <div class="exercise-anim-wrap">
        <svg viewBox="0 0 160 110" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dumbbell shoulder press exercise animation demonstration">
          <!-- Torso and Head -->
          <line x1="80" y1="46" x2="80" y2="94" stroke="${forest}" stroke-width="5" stroke-linecap="round" />
          <circle cx="80" cy="28" r="8" fill="${forest}" />
          <!-- Active Shoulder Deltoid Caps -->
          <circle cx="66" cy="46" r="7" fill="${lime}" />
          <circle cx="94" cy="46" r="7" fill="${lime}" />

          <!-- Animated Arms and Overhead Dumbbells -->
          <g class="anim-press-arms">
            <!-- Left arm holding dumbbell -->
            <polyline points="66,46 52,42 52,36" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
            <rect x="42" y="32" width="20" height="5" rx="1" fill="${forest}" />
            <rect x="40" y="28" width="5" height="13" rx="1" fill="${forest}" />
            <rect x="57" y="28" width="5" height="13" rx="1" fill="${forest}" />

            <!-- Right arm holding dumbbell -->
            <polyline points="94,46 108,42 108,36" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
            <rect x="98" y="32" width="20" height="5" rx="1" fill="${forest}" />
            <rect x="96" y="28" width="5" height="13" rx="1" fill="${forest}" />
            <rect x="113" y="28" width="5" height="13" rx="1" fill="${forest}" />
          </g>

          <!-- Label naming the exercise -->
          <text x="80" y="105" text-anchor="middle" class="exercise-anim-label">Shoulder Press (Overhead Extension)</text>
        </svg>
      </div>
    `;
  }

  // 5. PLANK ANIMATION (Isometric with breathing indicator)
  if (normalizedId === 'plank' || normalizedId === 'forearm-plank') {
    return `
      <div class="exercise-anim-wrap">
        <svg viewBox="0 0 160 110" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Plank isometric exercise animation demonstration">
          <!-- Floor Line -->
          <line x1="15" y1="90" x2="145" y2="90" stroke="${subtle}" stroke-width="2.5" />
          <!-- Planted Forearms on floor -->
          <line x1="95" y1="90" x2="114" y2="90" stroke="${forest}" stroke-width="4.5" stroke-linecap="round" />
          <line x1="102" y1="72" x2="102" y2="90" stroke="${forest}" stroke-width="3.5" stroke-linecap="round" />
          <!-- Planted Toes -->
          <circle cx="26" cy="90" r="4.5" fill="${forest}" />

          <!-- Rigid Plank Spine -->
          <line x1="26" y1="90" x2="105" y2="68" stroke="${forest}" stroke-width="4.5" stroke-linecap="round" />
          <!-- Head -->
          <circle cx="116" cy="64" r="7.5" fill="${forest}" />

          <!-- Animated Breathing Indicator (Gentle Core Pulse) -->
          <g class="anim-plank-breath">
            <circle cx="68" cy="78" r="9" fill="${lime}" fill-opacity="0.85" />
            <circle cx="68" cy="78" r="14" stroke="${lime}" stroke-width="1.8" stroke-dasharray="3 3" />
          </g>

          <!-- Label naming the exercise -->
          <text x="80" y="105" text-anchor="middle" class="exercise-anim-label">Plank (Isometric Core & Breathing)</text>
        </svg>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // STATIC PLACEHOLDER FOR ALL OTHER EXERCISES
  // --------------------------------------------------------------------------
  const matchingEx = EXERCISES.find(e => e.id === normalizedId);
  const iconType = matchingEx ? matchingEx.iconType : 'default';
  const exName = matchingEx ? matchingEx.name : 'Exercise Illustration';

  return `
    <div class="exercise-anim-wrap">
      ${getExerciseSvgIllustration(iconType)}
      <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase; margin-top: 4px;">
        ${exName}
      </div>
    </div>
  `;
}

// Attach to window for modular accessibility
window.EXERCISE_CATEGORIES = EXERCISE_CATEGORIES;
window.TARGET_BODY_PARTS = TARGET_BODY_PARTS;
window.EXERCISES = EXERCISES;
window.getExerciseSvgIllustration = getExerciseSvgIllustration;
window.getExerciseMovementAnimation = getExerciseMovementAnimation;

