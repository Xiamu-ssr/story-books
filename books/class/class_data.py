# -*- coding: utf-8 -*-
"""《阶级的秘密》18 页完整文案。
每页：文件名、标题、副标题、正文段落、要点框、配图提示词、3D模型名。
正文用儿童能懂的语言，但保留锋芒。html 转义已处理。
"""

STYLE = "Fresh detailed digital painting, warm sepia and gold with teal accents color palette, cinematic light, slightly dreamlike modern children's book illustration, historically evocative, no text."

# 每个元素:
# (num, file, title, subtitle, [正文段落...], takeaway, 图片prompt, 模型名, 模型alt)
PAGES = [
 # ---------- 古代篇 ----------
 ("01","cover","封面","","", "", "", ""),  # 占位，封面单独处理

 ("02","buffalo","公元前10000年，最后一只野牛","没有剩余，就没有阶级",
  ["一万多年前，你的祖先靠打猎和摘果子活着。",
   "那时候没有富人，也没有穷人。为什么？因为<span class='highlight'>食物存不下来</span>。今天打到一头野牛，全村今晚就吃光，放三天就臭了。",
   "没有东西可以'存起来慢慢用'，就没有人能比别人多占。大家一样饿，一样饱。",
   "所以记住第一句话：<span class='highlight'>不平等，是从'有东西可以剩下'才开始的。</span>"],
  "阶级的第一课：不平等的前提，是先有'剩余'。没有剩余，连'你的''我的'都不存在。",
  "A prehistoric savanna at dawn: a small tribe of hunter-gatherers sharing one bison around a fire, everyone equal, no possessions, no chief, stars fading above. Warm communal mood.",
  "bison","野牛"),

 ("03","wheat","公元前8000年，第一粒被存起来的麦子","剩余需要分配，分配产生权力",
  ["后来人们学会了种小麦。粮食可以晒干、存进仓库，放一年都不坏。",
   "这下，第一次有了'吃不完的东西'。",
   "可是粮食多了，就得有人<span class='highlight'>看守仓库、记账、决定分给谁</span>。谁来干？祭司和士兵。他们不用种地，却决定别人能分多少。",
   "你看，<span class='highlight'>管仓库的人，慢慢就变成了'官'</span>。权力，是从'分配剩余'里长出来的。"],
  "阶级的第二课：一旦出现剩余，就需要人分配。掌握分配权的人，成了最早的上层。",
  "An ancient granary scene: golden wheat being poured into large clay storage jars, a robed priest keeping tally marks on a clay tablet, armed guards at the door, farmers waiting outside for their share.",
  "granary","粮仓"),

 ("04","school","公元前3000年，神庙里的第一所学校","文字，是阶级的门票",
  ["在苏美尔（今天的伊拉克），有全世界最早的学校，叫'埃杜巴'。",
   "它教什么？教一种叫<span class='highlight'>楔形文字</span>的东西——用小木棍在泥板上刻字，记下谁交了多少粮、谁欠了多少债。",
   "会写字的人太少了，所以他们成了<span class='highlight'>最吃香的人</span>：记账、收税、立法，全离不开他们。",
   "从第一天起，<span class='highlight'>读书识字，就是通往上层的门票</span>。这张门票，今天还在用。"],
  "阶级的第三课：教育从诞生那天起，就是阶级的门票。会写字的人管着不识字的人。",
  "Inside a Sumerian temple school (edubba): young scribes pressing wedge-shaped cuneiform marks into wet clay tablets with reed styluses, a stern teacher watching, sunlight through a high window.",
  "clay_tablet","泥板"),

 # ---------- 中国近代篇 ----------
 ("05","keju","公元605年，一张桌子改变血统","科举：读书改命的默认程序",
  ["在中国，过去想当官，靠的是出身——爸爸是贵族，你才是。",
   "公元605年，隋炀帝搞了个新发明：<span class='highlight'>科举</span>。不管你是放牛娃还是富家子，只要考试考得好，就能做官。",
   "这是人类历史上第一次，<span class='highlight'>普通人有了一条凭本事往上爬的正规通道</span>。",
   "从那以后，'读书改变命运'刻进了中国人的骨头里。你现在每天坐的课桌，就是那条通道的延续。"],
  "阶级的第四课：分化永远存在，但'流动性'可以人为造出来。科举就是一台造了1300年的梯子。",
  "An imperial Chinese examination hall: rows of tiny isolated cells, a poor scholar writing furiously with a brush, a stack of classical books beside him, dawn light, hope and pressure in the air.",
  "exam_desk","科举考桌"),

 ("06","liangpiao","1958年，粮票与户口","国家直接分配一切",
  ["快进到1958年的中国。那时候，钱不是最重要的，<span class='highlight'>票</span>才是。",
   "买米要粮票，买布要布票，买肉要肉票。没有票，有钱也买不到。",
   "还有一个更厉害的，叫<span class='highlight'>户口</span>：它写明了你是'城里人'还是'乡下人'，很大程度上决定了你能去哪、能干什么。",
   "这是一个<span class='highlight'>国家把几乎所有东西都统一分配</span>的年代。你的爷爷辈，就是在这样的世界里长大的。"],
  "阶级的第五课：当国家直接分配一切，你的身份（户口、单位）就是你的命运。",
  "1950s China: hands exchanging colorful grain ration coupons (liangpiao) at a state shop counter, cloth and food coupons fanned out, a queue of people in grey and blue Mao suits, muted era colors.",
  "ration_coupon","粮票"),

 ("07","gaokao","1978年冬天，570万人的准考证","窗口重新打开",
  ["有一段时间，高考停了11年。能不能上大学，看推荐、看出身，不看分数。",
   "1978年，国家决定：<span class='highlight'>恢复高考</span>。不管你是农民还是工人，凭分数说话。",
   "那一年冬天，<span class='number'>570万</span>人涌进考场，很多人是从田里、从工厂直接赶来的，手上还有老茧。最后录取了27万。",
   "他们中间，就有后来的俞敏洪、刘强东。<span class='highlight'>一道关了11年的门，突然打开了——只是它只开给手里有准备的人。</span>"],
  "阶级的第六课：窗口打开时，手里得有牌。学习和本事，就是你攥在手里的牌。",
  "Winter 1978 China: a huge crowd of hopeful young people in padded winter coats queuing outside an exam hall, breath visible in cold air, one clutching a paper admission ticket and a worn book, sunrise breaking.",
  "admission_ticket","准考证"),

 # ---------- 国家体制篇 ----------
 ("08","single_track","1949-1980，中国：只有一个游戏可以玩","单轨制的逻辑",
  ["咱们先聊第一种玩法。想象全班只有一个游戏，所有人必须玩同一个。",
   "规则很清楚、入口只有一个、路只有一条。好处是：<span class='highlight'>心特别齐，能办大事</span>。",
   "但有个风险：万一这条轨道本身出了问题，<span class='highlight'>没人敢修</span>——因为所有人都在轨道上，谁动轨道谁就是和大家作对。",
   "这就是'单轨制'：要么一起走对，要么一起走错。"],
  "单轨制：规则清晰、执行力强，但最怕轨道本身出错——因为没人敢修。",
  "A single railway track stretching to the horizon, all people walking along the same single track in an orderly line, one uniform direction, vast empty land on both sides, symbolic.",
  "single_track","单轨"),

 ("09","multi_track","美国：让你觉得你可以赢","多轨制的逻辑",
  ["第二种玩法相反：班里有好多游戏，篮球、画画、编程……每个人都能挑。",
   "这叫'多轨制'。它给你一个特别重要的东西——<span class='highlight'>希望</span>。'美国梦'就是说：只要努力，你就能赢。",
   "但仔细看：很多游戏其实是<span class='highlight'>买彩票</span>，中奖的极少；真正定输赢的牌桌，早就坐满了人。",
   "它让你'觉得'你能赢。希望和真的机会，是两回事。"],
  "多轨制：用'希望'维持稳定。但要分清——你是在真牌桌上玩，还是在买彩票。",
  "A dazzling American carnival midway at dusk: many glowing game booths and a big lottery wheel, crowds reaching for prizes, one glittering 'American Dream' sign, mostly empty-handed players, seductive but hollow.",
  "lottery_wheel","彩票转盘"),

 ("10","soviet","1991年，苏联：游戏结束，没人会修","单轨制走到极端",
  ["苏联把'只有一个游戏'推到了头：几乎所有工厂、商店、土地，都归国家管。",
   "刚开始很猛，后来出问题了：商店里<span class='highlight'>货架空空</span>，人们排队几个小时买不到面包。",
   "最要命的是，大家知道有问题，<span class='highlight'>却没人有能力、也没人有胆量去修这条唯一的轨道</span>。",
   "1991年，整个系统'哐当'一声垮了。教训是：只有一个游戏时，它一出错，就是所有人的灾难。"],
  "单轨制走到极端：系统失去纠错能力，崩溃时没人能幸免。",
  "A bleak late-Soviet scene: a long queue of people in heavy winter coats outside a state store with empty shelves, a faded red star, grey snow falling, a sense of a huge machine grinding to a halt.",
  "empty_shelf","空货架"),

 ("11","wallstreet","2008年，华尔街：收割的高级形态","从收地租，到收利息",
  ["古代的'收租'很直接：你种我的地，收成给我一半。",
   "现代金融把这件事做得<span class='highlight'>看不见了</span>。它不抢你的粮食，它用'利息''债务''杠杆'，从你的账户数字里悄悄拿走。",
   "2008年，这套玩法玩过头，全世界的金融系统差点崩了。可最后倒霉的，<span class='highlight'>不是玩杠杆的银行家，而是丢了房子、丢了工作的普通人</span>。",
   "收割从来没停，只是工具越来越高级，越来越让你看不懂。"],
  "现代收割：不用见面，用利息和债务完成。崩溃时，买单的往往是底层。",
  "A gleaming Wall Street skyscraper made of stacked coins and contracts, paper debt swirling like a storm around it, tiny ordinary houses and people below being drawn upward into the vortex, 2008 financial crisis mood.",
  "coin_tower","硬币塔"),

 ("12","japan","日本：一亿总中流的幻觉","年功序列与新种姓",
  ["日本有个很美的说法，叫'一亿总中流'——意思是一亿日本人，全是中产，大家都差不多。",
   "曾经，这几乎是真的。但经济泡沫破了以后，社会悄悄分成了两种人：",
   "一种是<span class='highlight'>'正式员工'</span>，工作稳定、福利好；另一种是<span class='highlight'>'派遣员工'</span>，干一样的活，钱少一半，随时被辞退。",
   "同样是上班，却像两个阶级。再平等的社会，也可能长出新的、看不见的墙。"],
  "再平等的社会也会长出新墙：日本的新种姓，是'正式'与'派遣'之分。",
  "A modern Japanese office split in two: on one side secure full-time salarymen with warm desks and benefits, on the other side temporary dispatch workers with identical desks but grey and temporary badges, a subtle glass wall between.",
  "office_badge","工牌"),

 ("13","platform","平台：超越国界的收税人","新地主不收地租",
  ["以前的地主，收的是地租。今天出现了一种新'地主'：<span class='highlight'>平台</span>。",
   "你刷视频、点外卖、打游戏、搜答案——背后都是平台。它不收你的地租，它收三样新税：",
   "<span class='highlight'>数据税</span>（你的一切行为它都记下）、<span class='highlight'>注意力税</span>（你的时间被它卖掉）、<span class='highlight'>撮合费</span>（每一笔交易它都抽成）。",
   "最特别的是，这些新地主<span class='highlight'>不分国界</span>——它在中国收，也在美国收。这是人类历史上第一种跨国的收税人。"],
  "新地主是平台：它超越国界，收的是数据、注意力和撮合费。",
  "A giant glowing smartphone like a feudal castle towering over a landscape, tiny people and shops paying streams of light (data, attention, coins) upward into it, cables like castle roots spreading across a globe.",
  "data_castle","数据城堡"),

 # ---------- 农民与食利者篇 ----------
 ("14","farmer_old","古代农民：统计上的数字","他们养活文明，却没有名字",
  ["从苏美尔的麦田，到中国华北的平原，几千年里，人口最多的是同一种人：<span class='highlight'>农民</span>。",
   "他们种出粮食，养活了祭司、士兵、工匠、商人——养活了整个文明。",
   "可是翻遍史书，你找不到几个农民的名字。他们只出现在<span class='highlight'>税册</span>上，是一个数字，不是一个人。",
   "他们生产剩余，却从不参与制定分配的规则。<span class='highlight'>文明靠他们运转，却不为他们书写。</span>"],
  "农民，是分配链条的最底端：负责提供剩余，但不参与制定规则。",
  "Vast wheat fields across ancient civilizations: countless anonymous farmers bent over harvesting, their faces indistinct, a distant grand city and temple they feed but will never enter, golden but melancholic light.",
  "wheat_farmer","麦田农民"),

 ("15","rentier_old","古代食利者：免税的2%","法国，1789年以前",
  ["现在看对立面。1789年之前的法国，人分三个等级。",
   "第一等级是教士，第二等级是贵族。他们加起来只占人口的<span class='number'>2%</span>，却占着大部分土地，<span class='highlight'>而且几乎不用交税</span>。",
   "剩下的<span class='number'>98%</span>——农民、工匠、市民——辛苦干活，<span class='highlight'>却承担了几乎全部的税</span>。",
   "一边越种地越穷，一边不种地反而免税。你说，这样的社会能长久吗？后来，法国大革命爆发了。"],
  "古代食利者：2%的人免税，98%的人养他们。这就是法国大革命的真正导火索。",
  "Pre-revolutionary France 1788: an opulent aristocrat and cleric in silk at a lavish tax-exempt feast on one side, and ragged peasants handing over sacks of grain as taxes on the other, a stark dividing line down the middle.",
  "noble_feast","贵族宴席"),

 ("16","farmer_new","现代农民工：流动的血","他们建了城市，城市不属于他们",
  ["时间快进到今天的中国。农民换了个名字，叫<span class='highlight'>'农民工'</span>。",
   "他们离开土地，进城建起了高楼大厦、修好了地铁、送出了每一份外卖。城市越变越漂亮。",
   "可是，他们的户口还在农村。孩子想在城里上学，难；想在城里安家，更难。很多人干了一辈子，最后还是要<span class='highlight'>回到村里养老</span>。",
   "他们建起了城市，<span class='highlight'>但城市的很多规则，不是为他们定的</span>。"],
  "现代农民工：城市由他们建造，却不为他们设计。他们仍是最底层的供血者。",
  "Modern China: migrant construction workers in yellow helmets building glittering skyscrapers and subways, then at dusk walking toward a crowded station with woven bags to return to a distant village, the city lights behind them not theirs.",
  "hard_hat","安全帽"),

 ("17","rentier_new","现代食利者：钱生钱的世界","为什么睡觉的人比干活的人赚得多",
  ["对立的另一边，也换了个样子。今天最厉害的'食利者'，不是贵族，是<span class='highlight'>钱本身</span>。",
   "给你讲个真事。美国有个特别有钱的老人叫巴菲特。有一年他公开说：<span class='highlight'>'我交税的比例，比我的秘书还低。'</span>",
   "是不是很奇怪？其实是规则不一样：<span class='highlight'>秘书靠'干活'挣钱，税很重；巴菲特靠'钱生钱'，税很轻。</span>",
   "一个经济学家叫皮凯蒂，算了几百年的账，发现：<span class='highlight'>钱生钱的速度，一直比人干活挣钱快</span>。所以不干活的人，常常越睡越有钱。"],
  "现代食利者：钱生钱比人挣钱快（r>g）。看懂这条，你就懂了为什么光靠'努力'追不上。",
  "A cozy study at night: a kind old investor calmly asleep in an armchair while golden coins above him multiply on their own into growing stacks, beside him a tired secretary typing under a lamp earning slowly, contrast of money making money vs labor.",
  "money_growth","钱生钱"),

 # ---------- 未来篇 ----------
 ("18","dot","写给点点：看懂规则的人","从泥板到你手里的屏幕",
  ["点点，我们讲了一路，从一头野牛，讲到今天。其实只讲了一个问题：<span class='highlight'>谁干活、谁拿钱、谁定规则、谁兜底。</span>",
   "你会发现，没有哪种制度是完美的，它们只是用不同的方式回答这四个问题。",
   "而且记住一件事：<span class='highlight'>每一次重新洗牌，都是因为有了新工具</span>。印刷机让知识不再被锁起来，互联网让开店不要门面。",
   "今天你手里的这块屏幕，就是这个时代的新工具——它和当年的印刷机一样，是一次<span class='highlight'>重新排队的机会</span>。",
   "区别只在于：有人用它打开世界，有人用它打发时间。<span class='highlight'>看清规则→练好本事→抓住窗口。这个选择，在你手里。</span>"],
  "全书落点：不平等或许永远在，但窗口也一直在。看懂规则、练好本事、抓住窗口——这是你能做的。",
  "A hopeful child at a desk by a window at dawn, holding a glowing tablet from which a spiral of history rises: a bison, wheat, a clay tablet, an exam paper, a train ticket, a coin tower, a wheat stalk, all dissolving into stars, warm golden light.",
  "tablet_spiral","屏幕与历史螺旋"),
]
