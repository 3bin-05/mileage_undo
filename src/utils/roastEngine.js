// Local fallback roast database (Malayalam, Manglish, English)
// Organised by: Personality -> Language -> Rating

const ROASTS = {
  "Ammavan Mode": {
    Malayalam: {
      Excellent: [
        "Presidentinte medal tharanam mone! 22+ Kmpl ennu parayumbol ninte aishwaryam! Aathira kuttiye njan ninte kalyanathinayi aalochikkam.",
        "Kutty Swift aano atho bicycle aano chavittunnath? Kidu mileage! Nalla responsible aaya oru kutty!",
        "Ee 105 rupaye petrol vilayil 22+ mileage tharunnath daivathinte anugraham aanu mone. Responsible driver!",
        "Petrol rate ketti pedichu aano thurannu chavittathath? Kollam mone, nalla nalloru savings aayirikkum.",
        "Kidu mileage! 105 rupa aayapo responsible aaya oru driver aayi nee maariyallo. Njan shabaash parayുന്നു!"
      ],
      Good: [
        "Kuzhappamilla mone. Pakshe AC off aakki, chilla thurannittu kootiyal 2 kmpl koodi kittiyeene. Puthumuranmarodu paranjitt karyamilla.",
        "Nalla reethiyil odikkunnund. Ennalum Sharmajiyude makan Wagon R-il 24 kmpl edukkunnund. Athum koodi manasilirikkatte.",
        "Oru 105.50 rupa per litre ennu chindhikkumpol nannayi thonni. AC kurachu koodi off cheyyuka.",
        "Driving kollam. Pakshe clutch assembly and braking shradhichaal adutha thavana crude oil rate koodumbo thalarilla.",
        "Kollam mone, pakshe gear timely aayi shift cheythirunel pumpukaarante vaikiya kalyanam nadakkillayirunnu."
      ],
      Average: [
        "14 Kmpl? Ethrayo peru ithrayum petrol kond Gulf poyi thirichu varum! Karyangal shradhikkanam.",
        "Average aayittund. Pakshe ee odikkal odichal oru kalyanam kazhikkan pennu kittilla mone. Mileage anubhavichariyanam.",
        "105 rupa per litre adichitt 14 kmpl mathramo? AC fullil ittu blockil kidannal pocket chora thudangum mone.",
        "Veedinte aduthu thanne pump undennu vechu ingane waste aക്കല്ലേ. Swift pole oru vandi vechittu 13-14 kmpl tharunno?",
        "13-14 Kmpl aano mone ninte target? AC on aakki puzhu pole kidannu urulathe window thuranittu odikku."
      ],
      Poor: [
        "Ninne kond njan thottu! Ee plastic vandi eduthu nannayi ennu parayunnallo! Swift eduthal porayirunno? Enthoru nashtamaanu mone!",
        "AC full-il ittu paattu kettal mileage ingane irikkum. Njan okke chethakk odichirunna kaalath 45kmpl aayirunnu.",
        "Petrol rate 106 aayi mone! Ee accelerator chavitti chora kudikkalle! Pocketilaanu ootta ennariyaley?",
        "Oru responsible drive undo? Ninte gear maattal kandaal thonnum gear lever ninte shathru aano enn.",
        "AC full blockilum gear secondilum ittu odichal pocketile pacha niram poyi red aakum mone! 105 rupa mathi achan karayaan."
      ],
      Catastrophic: [
        "Kattapparayile pumpile aalukalkku ninne kandaal ippo thala vanangi thozhumallo! Vandi mathiyaakki nadakkan thudang mone.",
        "Ambani ninte peru swarnaksharathil avarde officil ezhuthi vechittund! Aana vandi polum ithrem fuel kudikkilla!",
        "Vandi aano atho crude oil pipeline aano? 105 rupa otha vilayulla petrol single shotil erakkunnallo thonniyavasi!",
        "Ee driving vech kalyanam kazhikkan ponaal penninte achan ninne pumpilekku adichu parayum!",
        "105 INR per litre petrol adichittu ingane engine run cheyyan nee entha central minister aano? Cycle vangu mone!"
      ]
    },
    Manglish: {
      Excellent: [
        "Super mone! President-inte medal tharanam. 20+ kmpl ennu paranjal aishwaryam aanu. Padippulla kuttikal ingane aanu.",
        "Excellent driving mone. Neighboring houseile unniye pole responsible aanu nee. Keep it up!",
        "105 rupees per litre aayittum 21+ mileage! Nee aanu daivathinte swantham responsible driver.",
        "Kidu mileage mone. Petrol price hike kandu pedichaano light-foot odikkunnath? Enthelum aakaam, savings nallatha.",
        "Superb mileage! Padippulla kuttikal Swift-il polum 22+ kmpl edukkum, nee athu prove cheythu."
      ],
      Good: [
        "Kuzhappamilla. But AC off aaki window thuranu ittirunel 2kmpl koodi kittiyene. Petrol cash achan alle tharunnath, athadaa.",
        "Good mileage mone, but AC off cheythirunel nalla savings aayene. Sharmaji's son is getting 23kmpl on Wagon R.",
        "Not bad, but check if you can avoid sudden braking. At 105 Rs, every drop is precious.",
        "Good driving. But don't build ego, keep trying to cross 20kmpl, then I will think about Aathira for you."
      ],
      Average: [
        "13 kmpl? Ennit aano ninakku ithrem jaada? Swift edukkatha apo kuttaye parayanum! Shradhichu odikkeda.",
        "14 kmpl is average mone. 105 Rs per litre petrol blockil kidannu waste aakkuvol nee achanude pocket tholpikkukayana.",
        "Wasting petrol at 105 Rs per litre! Please turn off engine in red light signal, simple logic!",
        "Average score. Don't drive like local racing boys. Change gears at correct RPM, my dear boy."
      ],
      Poor: [
        "Enthoru fuel waste aanu mone! Achan kashtapettu undakkunna cash ingane pukanju pokunnu. Car vikkunnathaa bhedham.",
        "Petrol rate 106 and you get 9 kmpl? Are you driving Swift or a battle tank? Change your style immediately.",
        "Your accelerator pressing is like stepping on a snake! So much rash driving. Fuel bill will kill you.",
        "Wasting money like water! Do you think crude oil is coming from our backyard well?"
      ],
      Catastrophic: [
        "Vandi drink petrol like water! Ninne polullavar karanam aanu crude oil vila koodunnath. Nadannu pokkoloo!",
        "105 rupees per litre and you get 5 kmpl? Ambani will build a statue of you in front of Reliance refinery!",
        "This is pure budget suicide! Sell this car, buy a pair of running shoes and start walking.",
        "You are single-handedly sponsoring the petrol pump owner's next luxury trip to Dubai. Stop this torture!"
      ]
    },
    English: {
      Excellent: [
        "Excellent mileage, my boy! Very responsible driving. You are saving India's economy single-handedly.",
        "Superb! If my son drove like this, I would have bought him a gold ring. Good job.",
        "Unbelievable mileage under 105 INR fuel hike! You are a middle-class financial wizard.",
        "Excellent driving! Keeping the RPM low and saving every drop of high-priced petrol.",
        "Maruti should hire you as a brand ambassador. 22+ kmpl is a dream!"
      ],
      Good: [
        "Good, but did you turn off the engine at the traffic light? Please check that first. Every drop counts!",
        "Good job, but you could have achieved 2 kmpl extra if you turned off AC on downhills.",
        "Solid performance. At 105 Rs per litre, your wallet is in safe hands. Keep it steady.",
        "Good driving style. Smooth shifting and decent acceleration habits."
      ],
      Average: [
        "Average driving. You want style also, AC also, speed also... then how can you get excellent mileage?",
        "Average mileage under a 105 Rs price hike is dangerous for your home budget. Be careful, my boy.",
        "13 kmpl is just okay. Turn off the AC and drive below 50 kmph to save some real cash.",
        "Average efficiency. You are accelerating too fast on short Kerala streets. Coast more!"
      ],
      Poor: [
        "Very bad! You are burning your father's hard-earned money. Sell this car and buy a bicycle, please.",
        "Fuel price is 105 Rs per litre and you get single-digit mileage? Your driving style is a financial disaster.",
        "Poor acceleration habits. You are riding the clutch and wasting expensive fuel. Learn from neighbors!",
        "Very poor economy. Stop racing with auto-rickshaws at every green light."
      ],
      Catastrophic: [
        "Oh my god! Are you driving a space rocket or a hatchback? Simply wasting national fuel resources!",
        "Catastrophic economy! The local petrol pump owner is putting a gold frame on your photo. Sell the car!",
        "At 105 Rs per litre, you are literally throwing dollar bills out of the window. Stop driving immediately!",
        "Your engine is consuming fuel faster than a KSRTC bus. Total budget disaster."
      ]
    }
  },
  "Driving Instructor Mode": {
    Malayalam: {
      Excellent: [
        "Njan padippichu thannath krithyamayi anusarichitund. Clutch assembly kooduthal kaalam nilanilkkum! Safe driving!",
        "Perfect gear shift timing, correct braking! Ee mileage ninte driving perfect aayathu kond mathram aanu.",
        "Aha! Brake chavittal kurachu, coasting kooduthal aakki. Petrol 105 aayapo driving perfect aayi!",
        "Clutch play nallapole balance cheyyunnund. Ee mileage ninte driving skillsinte thilakkam aanu."
      ],
      Good: [
        "Nannayi cheythittund. Ennalum speed breakeril 2nd gearil thanne pokkanam ennu njan paranjathu marannittilla ennu karuthunnu.",
        "Kuzhappamilla. Clutch pedalil kaalu thodathe odichal mileage 1kmpl kooduthal kittaam.",
        "Good shifting, but speed changes should be smoother. 105 rupa per litre adikkumpol shradhikkaam.",
        "Braking and shifting are steady. Try to turn off engine at signals lasting more than 30 seconds."
      ],
      Average: [
        "H-test thirichu pass aavendi varum mone. Clutch pidichu kidannaal mileage thazhe pokum ennu ariyillallo?",
        "Average control! Why are you accelerating in 3rd gear at 20kmph? Engine knocking and fuel waste!",
        "14 Kmpl is low. Kerala traffic blocks can be managed better with smooth coasting. Stop clutch riding!",
        "Engine RPM 2000 nu mukhalil kethalle mone. 105 rupa petrol aanu, simple common sense upayogikku."
      ],
      Poor: [
        "Enthoru accelerator chavittal aanu mone ath? Kadhakali chavittunnath pole chavittiyal engine karayum. 3rd gearil angane odikkalle!",
        "Clutch slide cheythu engine scream cheyyikkunnallo! Gear box ippo pukanju pokum. Petrol pumpil cash vitharan aano plan?",
        "Heavy foot acceleration is bad! At 105 Rs/litre, this rash driving is crime. Redo your road test!",
        "Worst gear control. You are driving a Swift like a tractor in high gear. Mileage has collapsed."
      ],
      Catastrophic: [
        "Licence aaraa thannath? Clutch plate ippo pukanju pോകും! Gear-ine kollathe, shradhichu chavittada!",
        "Who gave you license? You are stepping on accelerator like trying to crush a stone. Fuel consumption is insane!",
        "Absolute engine torture! 105 Rs petrol direct aayittu engine exhaustil ozhikkunnathaanu bhedham. Licence RTO-yeyelpi!",
        "Catastrophic driving. You are burning clutch and fuel simultaneously. Call a towing truck immediately!"
      ]
    },
    Manglish: {
      Excellent: [
        "Wow, perfect clutch release. Gear shift timing is 100/100. Best student!",
        "Excellent engine control. 20+ kmpl means clutch plates are in heaven. Good job!",
        "Perfect light-foot driving. Saving fuel worth 105 Rs per litre. My classes were useful."
      ],
      Good: [
        "Not bad, but you are still applying sudden brakes. Keep distance, save fuel!",
        "Good shift timing, but keep foot completely off the clutch pedal. It burns fuel and plates."
      ],
      Average: [
        "Average control. Why are you riding the clutch? Do you think clutch plate is free of cost?",
        "13 kmpl is not enough. You are still downshifting too late. Correct it in next driving log."
      ],
      Poor: [
        "Grinding gears like mixer grinder! No wonder the mileage is like an auto-rickshaw carrying cement.",
        "Heavy foot on accelerator detected! 105 Rs per litre is the rate, stop driving like a stunt master."
      ],
      Catastrophic: [
        "Who gave you license? RTO should cancel it today! You are killing the engine, please spare that poor car!",
        "Total license cancellation required! Clutch plate is smoking and fuel tank is leaking money. Disastrous!"
      ]
    },
    English: {
      Excellent: [
        "Perfect smooth acceleration. This is how a true driver behaves. Class performance!",
        "Phenomenal throttle management. Squeezing maximum mileage during high fuel pricing. Grade A+!"
      ],
      Good: [
        "Good. Try to coast in neutral when coming to stop. It will improve mileage by 5%.",
        "Decent clutch control. Shift up early to keep engine RPM in green eco zone."
      ],
      Average: [
        "Clutch riding detected! Stop keeping your foot on the clutch pedal, please.",
        "Average mileage. You are braking too often. Anticipate traffic flow to maintain momentum."
      ],
      Poor: [
        "Why are you accelerating in lower gears? The engine rpm is screaming! Terrible habits.",
        "Poor driving habits. Accelerator slamming burns 30% more fuel. Control your heavy foot!"
      ],
      Catastrophic: [
        "You are not driving, you are torturing the vehicle! Clutch plate is gone, gearbox is crying!",
        "Catastrophic gear grinding and throttle abuse. Cancel your license and travel by bus, please!"
      ]
    }
  },
  "Petrol Pump Owner Mode": {
    Malayalam: {
      Excellent: [
        "Cheyyunnath vazhiyile drowhamaanu mone! Ente pumpile nilanilp ninne pole ullavarude kayyilaanu! Koorachu koodi fuel kudikkeda!",
        "Chathi! Ente pumpil ninnu nee petrol adichal eniku loss aano mone? Ee mileage tharunna vandi direct kalyathekku vidu!",
        "22 Kmpl? Ninte ee responsible light-foot karanam ente pumpil ee maasam labham kuravaanu. Chenda driving aaku mone!",
        "Enthoru chathiyaanu ithu! 105 rupa petrol rate undennu vechu nee single droppil ananthapuri route odikkukayano?"
      ],
      Good: [
        "Kuzhappamilla, ennalum adutha thavana kooduthal petrol adikkendi varum ennu pratheekshikkunnu. Welcome back.",
        "Good mileage, but my pump business depends on your heavy accelerator. AC on cheyyu, fast aayitt pokko.",
        "Decent mileage, but I need you to buy premium petrol to make up for this low consumption."
      ],
      Average: [
        "Aha, average mileage! Ninte varavukal enikk eppozhum santhosham tharunnu. Premium customer filter boxil cheriya hole idu mone.",
        "14 Kmpl? Nalla score, keep visiting. 105 rupa per litre ennu parayumbol ente makkalude kalyanam ninte pocketil ninnaanu mone.",
        "Average consumption is sweet. You get decent mileage, I get decent profit. Perfect business partnership."
      ],
      Poor: [
        "Ninte car-inte photo enikku pumpil vekkanam mone! Enthoru snehamanu petrolinodu! Ee thavana oru tea free aayittu tharaam.",
        "Gedi, ninte chila vazhikal kandal mathi ente pumpile active customers listil nee thanne aavum no. 1!",
        "9 Kmpl! Wow, at 105.50 INR a litre, you are sponsoring my next gold chain. Love your driving style!",
        "High acceleration is gold! Come daily, my pump staff will salute you when you enter the gate."
      ],
      Catastrophic: [
        "Oh, njan ninte peril puthiya oru pump thudangaan aalochikkunnu! Ente kuttikalku nee deivam aanu mone! Please VIP listil kyaroo!",
        "Deivame! Ninte vandi oru chemical factory poleyanello! Daily adicholoo, pumpile sthalam ninakayi register cheyth tharaam.",
        "6 Kmpl! At 106 Rs per litre, you are literally buying me a new German car this month! Keep stepping on that accelerator!",
        "You are my absolute VIP! Swift run like a space rocket. Free oil filter for you today!"
      ]
    },
    Manglish: {
      Excellent: [
        "Very bad for my business! 20+ kmpl means you won't visit my pump next week. Sad.",
        "Chathi! 22 Kmpl means you are trying to shut down my petrol pump. Please push accelerator hard."
      ],
      Good: [
        "Okay but please visit again soon. The prices are changing, so buy more!",
        "Decent, but I prefer if you turn on the AC fully and drive in first gear in traffic."
      ],
      Average: [
        "Nice! 12 kmpl is sweet spot. I am happy, you are not crying too much. Good partnership.",
        "Average mileage is okay. 105 Rs rate keeps my bank account full. See you on Sunday!"
      ],
      Poor: [
        "Bro! Love you! You are my VIP customer. Please take a free calendar and key chain.",
        "8 kmpl at 105 rupees! You are sponsoring my daughter's MBBS seat. Hats off to your driving!"
      ],
      Catastrophic: [
        "Statue for you in my pump! My family lives on your Swift Petrol bills. Come daily, drink coffee for free!",
        "V8 engine mileage in a hatchback! You are a walking gold mine for our pump. Respect, boss!"
      ]
    },
    English: {
      Excellent: [
        "Oh, please don't buy cars like this. If everyone gets 24 kmpl, my petrol pump will close down!",
        "Horrible for my business. You are squeezing fuel like lemon. Please drive like a racer."
      ],
      Good: [
        "Okay, but please try to drive faster so that you burn some extra fuel."
      ],
      Average: [
        "Average customer. Neither profit nor loss. But I prefer your friend who gets 8 kmpl."
      ],
      Poor: [
        "Excellent! You are literally funding my daughter's wedding. Thank you for driving like a champion!",
        "Heavy acceleration at 105 INR a litre? You are my favorite customer. Free car wash for you!"
      ],
      Catastrophic: [
        "Respect, boss! You are buying petrol like you own a private jet. Let me register a lounge in your name at my pump!",
        "Catastrophic mileage! I am naming my new petrol outlet after you. Sponsoring my life single-handedly!"
      ]
    }
  },
  "KSRTC Driver Mode": {
    Malayalam: {
      Excellent: [
        "Kollam mone, pakshe ee speedil poyal orikkalum standil samayathinu ethilla. Mileage undenkilum samayam mukhyam!",
        "Aha, track clear aayathu kond mathram aanu ninte mileage! Oru Minnal bus ninte pinneil vannal nee oru vazhi aayene.",
        "Kidu mileage! Pakshe KSRTC standard shifting techniques padikkuka. Ennaal crude oil rate 110 kadannalum nee safe aanu."
      ],
      Good: [
        "Nannayi odikkunnund, overtake cheyyumpol gear shradhichu maattiyal mileage koodum.",
        "Good. Swift clean aayittu coasting cheyyunnund. Standard speed breaker cross timing nallatha."
      ],
      Average: [
        "Ee driving vech aano kochi-tvm routeil odikkaan varunnath? Businte mileage mathrame ullallo ninte Swift-inum!",
        "Average efficiency. Ee routeil KSRTC Super Fast blockil kidannaal polum 5 kmpl tharum. Ninakkenthada 12-14?",
        "105 rupa petrol blockil waste aakki irikkunnu. Gear control shradhichillel bus pass edukkendi varum."
      ],
      Poor: [
        "Ente Fast Passenger aana-vandi ithinekkal mileage tharum mone! Ee lag adicha driving kond aalukale chathikkalle.",
        "Heavy foot on Swift accelerator? Overtake cheyyumpol businte clutch engine scream aakkunna poleyaanu ninte driving.",
        "Pocket leak check cheyyu. Petrol 105 rupa cross cheythilla ennaano ninte manasilae vicharam?"
      ],
      Catastrophic: [
        "Bus overtake cheyyumpol kidannu pedals idikkunno? Accelerator pedal thirichu tharanam. KSRTC aana-vandi speedil poyalum 4.5kmpl tharum!",
        "Absolute disaster! Ninte Swift-inu ente 12-tonne Leyland businekkal kuravaanu mileage! Sell the car today!",
        "Kerala state roads are not for your petrol-burning drama. At 105 Rs, this mileage is budget execution!"
      ]
    },
    Manglish: {
      Excellent: [
        "Good mileage, but useless in high speed overtaking. You will lose the race to KSRTC!",
        "22 kmpl is solid. But you are driving too slow, blocking the route of KSRTC Minnal!"
      ],
      Good: [
        "Not bad, but keep left side when Super Fast is blowing horn behind you."
      ],
      Average: [
        "Average! If I drive my bus like you, RTO will suspend me within 2 hours.",
        "105 Rs per litre and you get only 13 kmpl on highway? Drive in green RPM band, gedi."
      ],
      Poor: [
        "Oh my god, even our old Leyland bus with 50 passengers gets better mileage than your fancy car!",
        "Heavy foot acceleration! Burning high-priced petrol like diesel generator in festival ground. Horrible."
      ],
      Catastrophic: [
        "Stop driving and go buy KSRTC bus pass! Your car is drinking diesel like a ship.",
        "Catastrophic driving. My heavy government bus is more efficient. Handover your license!"
      ]
    },
    English: {
      Excellent: [
        "Good mileage, but you are driving too slow like a cycle. Give way for KSRTC Super Fast!",
        "Impressive. You are squeezing fuel like a pro, but don't block the highway, please."
      ],
      Good: [
        "Decent. Keep the engine in green zone on tachometer. That is KSRTC rule."
      ],
      Average: [
        "Average efficiency. You cannot survive Kochi-Trivandrum route with this engine response.",
        "13 kmpl? Turn off the AC and maintain 50kmph in 5th gear. Learn highway code."
      ],
      Poor: [
        "Shame on you! My 12-tonne government bus gives 5 kmpl. Your 900kg car gets only 8 kmpl?",
        "Heavy foot on acceleration is a budget killer at 105 INR per litre. Stop racing."
      ],
      Catastrophic: [
        "Catastrophic waste of resource! Cancel your driving license and travel in public transport, please!",
        "Terrible efficiency. Even our fully loaded multi-axle Scania bus beats your mileage!"
      ]
    }
  },
  "Thrissur Ammavan Mode": {
    Malayalam: {
      Excellent: [
        "Entha mone gediye! Ente ponnu gedi, kidu mileage aanello! Vadakkumnathan ninnu oru prasadhavum aayitt vaa mone!",
        "Thrissur poora parambile aana polum ithrem nalla mileage tharilla! Kidu driving aanu mone!",
        "22 Kmpl mileage! Gedi nee puliyaanu! Petrol rate 105 aayapo gedi clutch timely aayi release cheythu thudangalle."
      ],
      Good: [
        "Kuzhappamilla da gedi, ennalum nalla Thrissur puzhukkum parippum kazhichal oru cherya shift koodi kittaam.",
        "Good mileage, gedi. Petrol 105 per litre aayathu kond nalloru savings aayi. Ennalum AC kurakkaam."
      ],
      Average: [
        "Entha gedi ithu? Ente pazhaya Ambassador 12 kmpl tharumayirunnu, appozha ninte puthiya plastic pettivandi!",
        "Average driving. 105 rupa per litre rate aayi, gedi accelerator speed blockil thottu kalikkalle."
      ],
      Poor: [
        "Aiyyo, ennoode chothichaal mathiyayirunnu, njan Chethakk eduthu thinnene! Ee vandi waste aanu gedi!",
        "Gedi, ninte driving kandal pumpile chettanmaar kayyadikkum. Ee 106 rupa petrol bill ninte achan tharathe thandum."
      ],
      Catastrophic: [
        "Deivame! Ninte vandi chila vazhikal kandal pampukaar vare aavalaathi parayum! Entha gedi ninte driving ingane aayathu?",
        "Absolute disaster, gedi! At 105 Rs a litre, you are driving like Thrissur Round is race track! Stop it!"
      ]
    },
    Manglish: {
      Excellent: [
        "Entha mone gediye! 20+ mileage is kickass! Come to Thrissur Round, I will buy you a biryani!",
        "Kidu mileage, gedi! Petrol 105 aayathukond pocket safe aayi. Ente Chetak level mass driving!"
      ],
      Good: [
        "Decent gedi. But if you drive without AC, you will save double and buy gold next year."
      ],
      Average: [
        "Average gedi. My old Bajaj Chetak 1994 model was giving 45kmpl, this is nothing!",
        "Average mileage. At 105 Rs, gedi needs to coast more in downhill slides. Shradhikkeda."
      ],
      Poor: [
        "Very poor da. Did you put oil in the engine or water? Go to mechanic Suku immediately.",
        "Poor driving gedi. Stepping on accelerator as if fuel is free. 105 Rs a litre is the rate!"
      ],
      Catastrophic: [
        "Absolute disaster gedi! The petrol pump owner is putting gold chain from your bills. Stop this show!",
        "Budget suicide gedi! Burning petrol at 105 rupees per litre like fire crackers. Walk to temple!"
      ]
    },
    English: {
      Excellent: [
        "Superb gedi! Thrissur people will celebrate your mileage with caparisoned elephants!",
        "22+ kmpl! Excellent gedi, saving money under high petrol rates. Perfect driver!"
      ],
      Good: [
        "Good gedi. But don't brag too much, we are checking actual tank-to-tank only."
      ],
      Average: [
        "Average. In Thrissur, even heavy loaded trucks give better mileage on state highway.",
        "Average score. With fuel at 105 Rs, gedi needs to shift gears at correct RPM."
      ],
      Poor: [
        "What is this, gedi? Total waste of cash. Sell this car and buy a nice walking stick.",
        "Terrible economy, gedi. Heavy foot on accelerator is draining your monthly income."
      ],
      Catastrophic: [
        "Disaster! Your car is drinking petrol like Thrissur pooram crowd drinks soda! Unbelievable!",
        "Absolute budget crash! 105 INR per litre and you get single digit mileage? Walk to your destination, gedi!"
      ]
    }
  },
  "Mechanic Mode": {
    Malayalam: {
      Excellent: [
        "Ee mileage tharunnundenkil engine nalla conditionilaanu. Pakshe oil level check cheyyanam, illenkil pani kittum.",
        "Kollam mone! Engine sound nalla smooth aanu. Engine maintenance correct aayitt cheyyunnundalle.",
        "Perfect fuel compression! Ee 105 rupa petrol rateil 22+ mileage tharunnathu engine healthinm pocketinm nallatha."
      ],
      Good: [
        "Kuzhappamilla. Chila vazhikalil spark plug replacement required aayekkalaam. Carbon clean cheyyuka.",
        "Good condition. Avoid riding the clutch pedal to prevent plate wear and fuel burn."
      ],
      Average: [
        "13 Kmpl? Piston ring leak aavan vazhi kaanുന്നു. Poga check cheyyu, air filter maattaan aayirunnu.",
        "Average economy. Carbon deposits in the injector. Clean it, otherwise 105 Rs petrol will burn uselessly."
      ],
      Poor: [
        "Clutch assembly poorthiyayi theernnu! Engine overheat aavunnund. 10,000 rupa ready aakki vechോളൂ mone.",
        "Heavy accelerator usage is destroying the cylinders. Gasket breakdown soon. Bring 15,500 Rs cash.",
        "Poor mileage. Exhaust smoke shows incomplete combustion of 105 Rs petrol. Engine servicing required."
      ],
      Catastrophic: [
        "Gasket poyi! Engine out aakkendi varum mone! Enthoru kariyamaanu! Vandi direct workshopilottu irakku.",
        "Catastrophic wear! Piston rings broken, gearbox shattered. Heavy foot acceleration has killed the block!",
        "Radiator dry, head warped! Running on 5 kmpl under 105 Rs petrol is double suicide. Call the scrap buyer!"
      ]
    },
    Manglish: {
      Excellent: [
        "Engine compression is perfect. Keep doing periodic service on time. Excellent condition!",
        "20+ mileage is proof of perfect cylinder health. Saving fuel and engine life simultaneously."
      ],
      Good: [
        "Not bad. Check tire pressure, it looks low. 33 PSI is standard."
      ],
      Average: [
        "Average. Carbon accumulation in fuel injectors. Better do clean up.",
        "13 kmpl is typical for dirty air filters. Change it soon to save 105 Rs petrol."
      ],
      Poor: [
        "Clutch plate slipping, transmission noise is high. Please keep 15,000 Rs cash ready.",
        "Accelerator slamming is killing spark plugs. High fuel bills at 105 Rs is the direct outcome."
      ],
      Catastrophic: [
        "Engine is ready to blow up! The head gasket is leaking like tap water in Kochi. Call towing crane!",
        "Total block damage! Single digit mileage under 105 Rs per litre is financial checkmate. Call crane!"
      ]
    },
    English: {
      Excellent: [
        "Perfect fuel combustion efficiency. Cylinders are working at 100%. Excellent health.",
        "Outstanding fuel-air ratio. Squeezing efficiency under high fuel prices. Good maintenance."
      ],
      Good: [
        "Good health, but recommend checking oxygen sensor at next 10k km service."
      ],
      Average: [
        "Average engine efficiency. Change air filter and throttle body cleaning is highly recommended."
      ],
      Poor: [
        "Poor mileage. Exhaust smoke shows incomplete combustion. Bring it to my shop tomorrow.",
        "Wasting 105 Rs per litre petrol due to clutch slipping. Get transmission checked ASAP."
      ],
      Catastrophic: [
        "Total engine seizure imminent! The radiator is dry, cylinder head warped. Stop driving immediately!"
      ]
    }
  }
};

/**
 * Generate a local rule-based roast based on parameters
 */
export const generateLocalRoast = ({
  vehicle,
  mileage,
  manufacturerMileage,
  personalityMode,
  language
}) => {
  const pMode = ROASTS[personalityMode] ? personalityMode : "Ammavan Mode";
  const lang = ROASTS[pMode][language] ? language : "English";
  
  // Determine rating based on default benchmarks if manufacturer claim isn't present
  let rating;
  const mfg = parseFloat(manufacturerMileage);
  
  if (mfg && !isNaN(mfg)) {
    const ratio = mileage / mfg;
    if (ratio >= 0.95) rating = "Excellent";
    else if (ratio >= 0.80) rating = "Good";
    else if (ratio >= 0.60) rating = "Average";
    else if (ratio >= 0.40) rating = "Poor";
    else rating = "Catastrophic";
  } else {
    if (mileage >= 21.0) rating = "Excellent";
    else if (mileage >= 16.0) rating = "Good";
    else if (mileage >= 12.0) rating = "Average";
    else if (mileage >= 8.0) rating = "Poor";
    else rating = "Catastrophic";
  }

  const list = ROASTS[pMode][lang][rating];
  // Select a random roast from the matching bucket
  const randomIndex = Math.floor(Math.random() * list.length);
  let roastText = list[randomIndex];

  // Optional: inject vehicle model in the roast dynamically if there's an opportunity
  roastText = roastText.replace(/Swift/g, vehicle || "Swift");
  
  return roastText;
};
