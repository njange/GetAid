export const courses = [
  {
    slug: "cpr",
    title: "CPR Basics",
    tagline: "Restore breathing and circulation when someone collapses.",
    icon: "cpr",
    category: "Essential Skills",
    objectives: [
      { icon: "vital_signs", title: "Assess the Situation", description: "Recognize when someone needs CPR and act within the first critical seconds." },
      { icon: "front_hand", title: "Perform Compressions", description: "Use the correct hand placement, depth, and rate to keep blood circulating." },
      { icon: "health_and_safety", title: "Use an AED", description: "Combine compressions, rescue breaths, and a defibrillator to give the best chance of survival." },
    ],
    lessons: [
      {
        slug: "when-to-start",
        title: "When to start CPR",
        minutes: 4,
        body: [
          { type: "p", text: "CPR (cardiopulmonary resuscitation) keeps blood moving to the brain and heart when someone's own circulation has stopped. Acting fast in the first few minutes makes the biggest difference to their chances." },
          {
            type: "steps",
            items: [
              "Check the scene is safe, then tap their shoulders and shout to see if they respond.",
              "If there's no response, call your local emergency number immediately — or point at someone and tell them to call while you continue.",
              "Look for normal breathing for no more than 10 seconds. Gasping or irregular breathing is not normal.",
              "If they aren't breathing normally, start chest compressions right away.",
            ],
          },
          { type: "warning", text: "Never start compressions on someone who is awake, moving, or breathing normally — this can cause injury." },
        ],
      },
      {
        slug: "chest-compressions",
        title: "Chest compressions",
        minutes: 5,
        body: [
          { type: "p", text: "Compressions are the most important part of CPR. Hard, fast, uninterrupted pushes keep oxygenated blood circulating." },
          {
            type: "steps",
            items: [
              "Kneel beside the person and place the heel of one hand on the center of their chest, between the nipples.",
              "Place your other hand on top and interlock your fingers, keeping your arms straight.",
              "Push straight down at least 2 inches (5 cm), then let the chest fully recoil between pushes.",
              "Aim for 100–120 compressions per minute — roughly the beat of 'Stayin' Alive'.",
            ],
          },
          { type: "tip", text: "Compressions are tiring. If someone else is trained, swap every 2 minutes to keep the depth and rate consistent." },
        ],
      },
      {
        slug: "rescue-breaths",
        title: "Rescue breaths",
        minutes: 4,
        body: [
          { type: "p", text: "If you're trained and willing, rescue breaths add oxygen between rounds of compressions. If you're not trained or comfortable, hands-only CPR (compressions only, no stopping) is still highly effective." },
          {
            type: "steps",
            items: [
              "After 30 compressions, tilt the head back and lift the chin to open the airway.",
              "Pinch the nose shut, make a full seal over their mouth with yours, and give one breath for about 1 second, watching the chest rise.",
              "Give a second breath the same way.",
              "Return immediately to 30 more compressions. Repeat the 30:2 cycle until help arrives.",
            ],
          },
        ],
      },
      {
        slug: "using-an-aed",
        title: "Using an AED",
        minutes: 5,
        body: [
          { type: "p", text: "An automated external defibrillator (AED) can restart a normal heart rhythm. Modern AEDs are built for untrained bystanders — they talk you through every step." },
          {
            type: "steps",
            items: [
              "Turn the AED on and follow its spoken instructions.",
              "Wipe the chest dry and attach the pads exactly where the pictures show — bare skin, one below the collarbone, one on the lower side.",
              "Make sure nobody is touching the person while the AED analyzes the heart rhythm.",
              "If it advises a shock, ensure everyone is clear and press the shock button, then resume compressions immediately.",
            ],
          },
          { type: "warning", text: "Never use an AED near standing water or on someone lying in a puddle — move them to a dry area first." },
        ],
      },
    ],
  },
  {
    slug: "choking",
    title: "Choking Response",
    tagline: "Clear a blocked airway before oxygen runs out.",
    icon: "choking",
    category: "Essential Skills",
    objectives: [
      { icon: "priority_high", title: "Recognize a Blocked Airway", description: "Tell the difference between a partial and full airway obstruction." },
      { icon: "front_hand", title: "Clear the Airway", description: "Deliver back blows and abdominal thrusts safely and effectively." },
      { icon: "emergency", title: "Respond If They Collapse", description: "Switch to CPR and keep checking the mouth if the person becomes unresponsive." },
    ],
    lessons: [
      {
        slug: "recognizing-choking",
        title: "Recognizing choking",
        minutes: 3,
        body: [
          { type: "p", text: "A person with a fully blocked airway can't speak, cry, or cough effectively. They may clutch their throat, panic, and their lips may start to turn blue." },
          {
            type: "steps",
            items: [
              "Ask clearly, 'Are you choking?'",
              "If they can still cough forcefully or speak, encourage them to keep coughing — don't intervene yet.",
              "If they can't make sound, can't breathe, or are turning blue, treat it as a full blockage and act immediately.",
            ],
          },
        ],
      },
      {
        slug: "back-blows",
        title: "Back blows",
        minutes: 3,
        body: [
          { type: "p", text: "Back blows are usually tried first, especially for infants or when abdominal thrusts aren't possible." },
          {
            type: "steps",
            items: [
              "Stand slightly behind and to the side of the person and support their chest with one hand.",
              "Bend them forward so the object can fall out of their mouth rather than down further.",
              "Give up to 5 firm blows between the shoulder blades with the heel of your hand.",
              "Check their mouth between blows — if the object is visible and loose, remove it carefully.",
            ],
          },
        ],
      },
      {
        slug: "abdominal-thrusts",
        title: "Abdominal thrusts (Heimlich)",
        minutes: 4,
        body: [
          { type: "p", text: "If back blows don't clear the airway, move on to abdominal thrusts." },
          {
            type: "steps",
            items: [
              "Stand behind the person and wrap your arms around their waist.",
              "Make a fist and place it thumb-side in, just above their belly button.",
              "Grasp your fist with your other hand and pull sharply inward and upward.",
              "Repeat in sets of 5, alternating with back blows, until the object is expelled or they can breathe.",
            ],
          },
          { type: "warning", text: "Use gentle chest thrusts instead of abdominal thrusts for infants under 1 year old, and be extra cautious with pregnant or larger individuals." },
        ],
      },
      {
        slug: "if-unresponsive",
        title: "If they become unresponsive",
        minutes: 3,
        body: [
          { type: "p", text: "If the person stops responding, lower them carefully to the ground and call your emergency number right away if you haven't already." },
          {
            type: "steps",
            items: [
              "Begin CPR, starting with chest compressions.",
              "Each time you open the airway for a breath, look inside the mouth for the object — remove it only if you can clearly see it.",
              "Continue CPR until emergency services arrive or the person starts breathing normally.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "burns",
    title: "Burns Care",
    tagline: "Cool the burn, protect the skin, know when to escalate.",
    icon: "burns",
    category: "Injury Care",
    objectives: [
      { icon: "thermostat", title: "Grade the Burn", description: "Judge severity by size, location, and depth to decide how urgent it is." },
      { icon: "water_drop", title: "Cool It Properly", description: "Use cool running water for 20 minutes to limit tissue damage." },
      { icon: "health_and_safety", title: "Know When to Escalate", description: "Spot the warning signs that mean a burn needs emergency care." },
    ],
    lessons: [
      {
        slug: "assessing-severity",
        title: "Assessing burn severity",
        minutes: 3,
        body: [
          { type: "p", text: "Burns are graded by depth. First-degree burns redden the skin, second-degree burns blister, and third-degree burns can look white, leathery, or charred and may not hurt due to nerve damage." },
          {
            type: "steps",
            items: [
              "Check the size — a burn larger than the person's palm needs medical attention.",
              "Check the location — burns on the face, hands, feet, groin, or over a joint need urgent care.",
              "Check the depth — blistering or white/charred skin means it's more than superficial.",
            ],
          },
        ],
      },
      {
        slug: "cooling-the-burn",
        title: "Cooling the burn",
        minutes: 4,
        body: [
          { type: "p", text: "Cooling a burn quickly limits how deep the damage goes." },
          {
            type: "steps",
            items: [
              "Remove the person from the heat source and take off nearby clothing or jewelry unless it's stuck to the skin.",
              "Run cool (not ice-cold) running water over the burn for 20 minutes.",
              "Cover loosely with a clean, non-fluffy dressing or cling film once cooled.",
              "Keep the person warm elsewhere on their body to avoid hypothermia during cooling.",
            ],
          },
          { type: "tip", text: "20 minutes feels long — set a timer so you don't stop early." },
        ],
      },
      {
        slug: "what-not-to-do",
        title: "What not to do",
        minutes: 2,
        body: [
          {
            type: "steps",
            items: [
              "Don't apply ice, butter, oil, or toothpaste — they can trap heat or cause infection.",
              "Don't burst blisters — this raises infection risk.",
              "Don't use fluffy cotton wool or anything that can stick to the wound.",
              "Don't pull off clothing that's stuck to the burnt skin.",
            ],
          },
        ],
      },
      {
        slug: "when-to-seek-care",
        title: "When to seek emergency care",
        minutes: 3,
        body: [
          {
            type: "steps",
            items: [
              "The burn is larger than the person's palm, or on the face, hands, feet, groin, or a joint.",
              "The skin is white, leathery, or charred (third-degree).",
              "The burn was caused by chemicals, electricity, or prolonged exposure.",
              "The person is a baby, young child, or older adult.",
            ],
          },
          { type: "warning", text: "Call emergency services immediately for large, deep, or electrical/chemical burns." },
        ],
      },
    ],
  },
  {
    slug: "wounds",
    title: "Wounds & Bleeding",
    tagline: "Clean minor cuts and control serious bleeding.",
    icon: "wounds",
    category: "Injury Care",
    objectives: [
      { icon: "clean_hands", title: "Clean Minor Wounds", description: "Rinse, dry, and dress small cuts to prevent infection." },
      { icon: "front_hand", title: "Control Severe Bleeding", description: "Apply firm, direct pressure and a pressure dressing to stop serious blood loss." },
      { icon: "vital_signs", title: "Watch for Infection", description: "Recognize the signs a wound needs medical attention." },
    ],
    lessons: [
      {
        slug: "cleaning-a-minor-wound",
        title: "Cleaning a minor wound",
        minutes: 3,
        body: [
          {
            type: "steps",
            items: [
              "Wash your hands before touching the wound.",
              "Rinse the wound under clean running water to remove dirt and debris.",
              "Pat the area dry with a clean cloth and apply a sterile adhesive bandage or dressing.",
              "Change the dressing daily or whenever it gets wet or dirty.",
            ],
          },
        ],
      },
      {
        slug: "controlling-severe-bleeding",
        title: "Controlling severe bleeding",
        minutes: 5,
        body: [
          { type: "p", text: "Severe bleeding can become life-threatening within minutes. Direct pressure is the single most effective first step." },
          {
            type: "steps",
            items: [
              "Call emergency services or have someone else call immediately.",
              "Press firmly on the wound with a clean cloth, dressing, or your hand if nothing else is available.",
              "Keep steady, firm pressure — don't lift the cloth to check, add more layers on top if it soaks through.",
              "If possible, raise the injured area above heart level while continuing pressure.",
            ],
          },
          { type: "warning", text: "If bleeding is spurting or won't stop with pressure, this is a medical emergency — keep pressing and get help en route." },
        ],
      },
      {
        slug: "applying-a-pressure-dressing",
        title: "Applying a pressure dressing",
        minutes: 4,
        body: [
          {
            type: "steps",
            items: [
              "Place a sterile pad directly over the wound.",
              "Wrap a bandage firmly over the pad, extending well beyond its edges.",
              "Check circulation below the dressing — fingers or toes should stay warm and a normal color.",
              "If blood soaks through, add more dressing on top rather than removing the original layer.",
            ],
          },
        ],
      },
      {
        slug: "signs-of-infection",
        title: "Signs of infection",
        minutes: 3,
        body: [
          {
            type: "steps",
            items: [
              "Increasing redness, warmth, or swelling around the wound after the first day or two.",
              "Pus or a foul smell coming from the wound.",
              "Red streaks spreading from the wound, or a fever.",
              "The wound isn't closing or is getting more painful instead of less.",
            ],
          },
          { type: "tip", text: "See a healthcare provider if any of these appear — early treatment prevents complications." },
        ],
      },
    ],
  },
  {
    slug: "drowning",
    title: "Drowning Response",
    tagline: "Rescue safely and support breathing afterward.",
    icon: "drowning",
    category: "Essential Skills",
    objectives: [
      { icon: "pool", title: "Rescue Safely", description: "Reach or throw before you swim — protect yourself while helping someone in the water." },
      { icon: "front_hand", title: "Get Them Out Safely", description: "Support the head and neck and check breathing the moment they're out of the water." },
      { icon: "health_and_safety", title: "Support Their Breathing", description: "Give rescue breaths first, then follow up with CPR and medical care." },
    ],
    lessons: [
      {
        slug: "water-rescue-safety",
        title: "Water rescue safety",
        minutes: 3,
        body: [
          { type: "p", text: "More people drown attempting untrained rescues than you'd expect. Protect yourself first." },
          {
            type: "steps",
            items: [
              "Call for help before entering the water yourself.",
              "Reach with a pole, branch, or clothing, or throw something that floats rather than swimming out if you can avoid it.",
              "Only swim to the person as a last resort, and only if you're a confident swimmer.",
              "Approach from behind if possible — a panicking person can pull a rescuer under.",
            ],
          },
        ],
      },
      {
        slug: "getting-them-out-safely",
        title: "Getting them out safely",
        minutes: 3,
        body: [
          {
            type: "steps",
            items: [
              "Support the person's head and neck if you suspect a diving or impact injury.",
              "Get them onto a firm, flat surface as quickly and safely as possible.",
              "Check for breathing as soon as they're out of the water.",
              "Call emergency services if you haven't already, even if they seem alert.",
            ],
          },
        ],
      },
      {
        slug: "rescue-breaths-for-drowning",
        title: "Rescue breaths for drowning",
        minutes: 4,
        body: [
          { type: "p", text: "Drowning is primarily an oxygen problem, so rescue breaths are especially important — unlike sudden cardiac arrest, starting with breaths rather than compressions is recommended if you're trained." },
          {
            type: "steps",
            items: [
              "If they aren't breathing, give 5 initial rescue breaths before starting compressions.",
              "Then continue with standard CPR: 30 compressions to 2 breaths.",
              "Expect them to vomit water — turn their head to the side if this happens and continue CPR once clear.",
            ],
          },
        ],
      },
      {
        slug: "after-the-rescue",
        title: "After the rescue",
        minutes: 3,
        body: [
          {
            type: "steps",
            items: [
              "Even a person who recovers quickly and seems fine should be seen by a medical professional.",
              "Water can irritate the lungs for hours afterward, a delayed reaction sometimes called secondary drowning.",
              "Keep them warm and monitor their breathing closely until help arrives or they've been checked out.",
            ],
          },
          { type: "warning", text: "Never assume someone is fine just because they're coughing and conscious after a near-drowning — always seek medical follow-up." },
        ],
      },
    ],
  },
  {
    slug: "fractures",
    title: "Fractures & Sprains",
    tagline: "Support the injury and avoid making it worse.",
    icon: "fractures",
    category: "Injury Care",
    objectives: [
      { icon: "personal_injury", title: "Spot a Fracture", description: "Recognize deformity, swelling, and loss of function that signal a break." },
      { icon: "front_hand", title: "Immobilize the Area", description: "Support and splint the injury without trying to realign it." },
      { icon: "emergency", title: "Know When to Go to the ER", description: "Identify the red flags that mean it's more than a simple sprain." },
    ],
    lessons: [
      {
        slug: "spotting-a-fracture",
        title: "Spotting a possible fracture",
        minutes: 3,
        body: [
          {
            type: "steps",
            items: [
              "Look for obvious deformity, swelling, or a limb pointing in an unnatural direction.",
              "Ask about the pain — a fracture often causes sharp, localized pain that worsens with movement.",
              "Check if they can bear weight or use the limb normally — inability is a red flag.",
              "When in doubt, treat it as a fracture rather than a sprain.",
            ],
          },
        ],
      },
      {
        slug: "immobilizing-the-area",
        title: "Immobilizing the area",
        minutes: 4,
        body: [
          {
            type: "steps",
            items: [
              "Don't try to straighten or realign the injury.",
              "Support the joints above and below the injury to stop it moving.",
              "Use a rolled towel, magazine, or purpose-made splint to keep the area still.",
              "Check fingers or toes below the splint regularly for warmth and color to make sure it's not too tight.",
            ],
          },
          { type: "warning", text: "If bone is visible through the skin, cover it loosely with a clean dressing and do not try to push it back in — seek emergency care immediately." },
        ],
      },
      {
        slug: "rice-for-sprains",
        title: "RICE for sprains",
        minutes: 4,
        body: [
          { type: "p", text: "For milder sprains and strains, the RICE method reduces swelling and speeds recovery." },
          {
            type: "steps",
            items: [
              "Rest — stop using the injured area right away.",
              "Ice — apply a cold pack wrapped in cloth for 15–20 minutes at a time.",
              "Compression — wrap snugly with an elastic bandage, not tight enough to cut off circulation.",
              "Elevation — raise the injured area above heart level when possible.",
            ],
          },
        ],
      },
      {
        slug: "when-to-go-to-the-er",
        title: "When to go to the ER",
        minutes: 3,
        body: [
          {
            type: "steps",
            items: [
              "Visible deformity or bone through the skin.",
              "The limb or joint looks blue, very pale, or feels numb or cold below the injury.",
              "Severe pain that isn't easing with rest and support.",
              "Any suspected fracture in the neck, back, hip, or thigh — call emergency services and avoid moving the person.",
            ],
          },
        ],
      },
    ],
  },
];

export function getCourse(slug) {
  return courses.find((course) => course.slug === slug);
}

export function getLesson(courseSlug, lessonSlug) {
  const course = getCourse(courseSlug);
  if (!course) return { course: undefined, lesson: undefined, index: -1 };
  const index = course.lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  return { course, lesson: course.lessons[index], index };
}
