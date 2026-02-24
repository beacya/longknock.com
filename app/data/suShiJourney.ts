export type TimePrecision = "exact" | "fuzzy" | "disputed";

export interface Location {
  ancientName: string;
  modernName: string;
  coordinates: [number, number]; // [lon, lat]
  precision: TimePrecision;
}

export interface JourneyEvent {
  id: string;
  year: number;
  yearEnd?: number;
  displayDate: string;
  confidence: number; // 0.1 - 1.0
  location: Location;
  title: string;
  description: string;
  literaryWork?: string;
  isKeyNode?: boolean;
}

export interface JourneyData {
  subject: string;
  subjectChinese: string;
  period: string;
  theme: string;
  events: JourneyEvent[];
}

export const suShiJourney: JourneyData = {
  subject: "Su Shi (Su Dongpo)",
  subjectChinese: "苏轼（苏东坡）",
  period: "1056 – 1101 CE",
  theme: "渺沧海之一粟 · A Grain in the Vast Ocean",
  events: [
    {
      id: "meishan-birth",
      year: 1056,
      displayDate: "嘉祐元年（1056年）",
      confidence: 1.0,
      isKeyNode: true,
      location: {
        ancientName: "眉山",
        modernName: "四川省眉山市",
        coordinates: [103.848, 30.077],
        precision: "exact",
      },
      title: "出川赴京",
      description:
        "苏轼与父苏洵、弟苏辙自眉山出发，赴京应试。少年初离故土，意气风发，不知此去山高水远，半生漂泊。",
      literaryWork: "《和子由渑池怀旧》",
    },
    {
      id: "kaifeng-exam",
      year: 1057,
      displayDate: "嘉祐二年（1057年）",
      confidence: 1.0,
      location: {
        ancientName: "汴京",
        modernName: "河南省开封市",
        coordinates: [114.308, 34.792],
        precision: "exact",
      },
      title: "金榜题名",
      description:
        "苏轼参加礼部考试，以一篇《刑赏忠厚之至论》震动考官欧阳修，高中进士。欧阳修叹曰：此人可谓善读书，善用书，他日文章必独步天下。",
    },
    {
      id: "kaifeng-hanlin",
      year: 1069,
      displayDate: "熙宁二年（1069年）",
      confidence: 1.0,
      isKeyNode: true,
      location: {
        ancientName: "汴京",
        modernName: "河南省开封市",
        coordinates: [114.308, 34.792],
        precision: "exact",
      },
      title: "与王安石政见相左",
      description:
        "王安石推行新法，苏轼上书反对，因不见容于新党，自请外放。他宁可远离权力中心，也不愿违背良知。",
    },
    {
      id: "hangzhou-first",
      year: 1071,
      yearEnd: 1074,
      displayDate: "熙宁四年至七年（1071–1074年）",
      confidence: 1.0,
      isKeyNode: true,
      location: {
        ancientName: "杭州",
        modernName: "浙江省杭州市",
        coordinates: [120.154, 30.287],
        precision: "exact",
      },
      title: "通判杭州",
      description:
        `苏轼通判杭州，泛舟西湖，写下"欲把西湖比西子，淡妆浓抹总相宜"。他疏浚西湖、修筑苏堤，政绩卓著，深受百姓爱戴。`,
      literaryWork: "《饮湖上初晴后雨》",
    },
    {
      id: "huzhou-governor",
      year: 1079,
      displayDate: "元丰二年（1079年）春",
      confidence: 1.0,
      location: {
        ancientName: "湖州",
        modernName: "浙江省湖州市",
        coordinates: [120.086, 30.894],
        precision: "exact",
      },
      title: "知湖州",
      description:
        `苏轼任湖州知州，上《湖州谢上表》，文中几句被新党摘取，指为讥讽朝廷，酿成"乌台诗案"的导火索。`,
    },
    {
      id: "kaifeng-prison",
      year: 1079,
      displayDate: "元丰二年（1079年）秋",
      confidence: 1.0,
      location: {
        ancientName: "御史台（乌台）",
        modernName: "河南省开封市",
        coordinates: [114.31, 34.78],
        precision: "exact",
      },
      title: "乌台诗案·系狱",
      description:
        `苏轼被押解入京，囚于御史台。御史台多植柏树，乌鸦栖宿其上，故称"乌台"。他在狱中写下绝笔诗，以为必死，不料百余日后获救出狱。`,
    },
    {
      id: "huangzhou-exile",
      year: 1080,
      yearEnd: 1084,
      displayDate: "元丰三年至七年（1080–1084年）",
      confidence: 1.0,
      isKeyNode: true,
      location: {
        ancientName: "黄州",
        modernName: "湖北省黄冈市",
        coordinates: [114.879, 30.447],
        precision: "exact",
      },
      title: "谪居黄州",
      description:
        `贬为黄州团练副使，不得签书公事。苏轼在此躬耕东坡，自号"东坡居士"。困顿中，他写就《念奴娇·赤壁怀古》与前后《赤壁赋》，于沧桑中悟得"渺沧海之一粟"。`,
      literaryWork: "《念奴娇·赤壁怀古》《前赤壁赋》《后赤壁赋》",
    },
    {
      id: "chibi-fuzzy",
      year: 1082,
      displayDate: "约元丰五年（1082年）秋冬",
      confidence: 0.6,
      location: {
        ancientName: "赤壁（存疑）",
        modernName: "湖北省黄冈市赤壁矶（一说蒲圻）",
        coordinates: [114.55, 30.2],
        precision: "disputed",
      },
      title: "泛舟赤壁",
      description:
        `苏轼与客泛舟游于赤壁之下，写下千古名篇。此处"赤壁"非三国古战场，乃黄州城外赤鼻矶，然苏轼借景发怀，"固一世之雄也，而今安在哉"。`,
      literaryWork: "《前赤壁赋》",
    },
    {
      id: "hangzhou-second",
      year: 1089,
      yearEnd: 1091,
      displayDate: "元祐四年至六年（1089–1091年）",
      confidence: 1.0,
      isKeyNode: true,
      location: {
        ancientName: "杭州",
        modernName: "浙江省杭州市",
        coordinates: [120.162, 30.281],
        precision: "exact",
      },
      title: "再知杭州",
      description:
        `元祐更化，旧党执政，苏轼再度知杭州。他主持疏浚西湖，以湖泥筑成苏堤，造福百姓，"苏堤春晓"成西湖十景之一，千年犹存。`,
      literaryWork: "《乞开杭州西湖状》",
    },
    {
      id: "huizhou-exile",
      year: 1094,
      yearEnd: 1097,
      displayDate: "绍圣元年至四年（1094–1097年）",
      confidence: 1.0,
      location: {
        ancientName: "惠州",
        modernName: "广东省惠州市",
        coordinates: [114.415, 23.112],
        precision: "exact",
      },
      title: "再贬惠州",
      description:
        `章惇执政，苏轼再遭贬谪，远放岭南惠州。他以"日啖荔枝三百颗，不辞长作岭南人"自嘲，但此诗又惹怒宰相，将他一贬再贬至天涯海角。`,
      literaryWork: "《惠州一绝》",
    },
    {
      id: "danzhou-hainan",
      year: 1097,
      yearEnd: 1100,
      displayDate: "绍圣四年至元符三年（1097–1100年）",
      confidence: 1.0,
      isKeyNode: true,
      location: {
        ancientName: "儋州",
        modernName: "海南省儋州市",
        coordinates: [109.576, 19.521],
        precision: "exact",
      },
      title: "绝域儋州",
      description:
        `苏轼被贬至宋朝版图最南端——海南儋州，彼时此地被视为"蛮荒之地"，流放至此形同死刑。然苏轼在此开学堂、教化民众，海南文脉由此而兴。三年后他感慨："九死南荒吾不恨，兹游奇绝冠平生。"`,
      literaryWork: "《自题金山画像》",
    },
    {
      id: "changzhou-death",
      year: 1101,
      displayDate: "建中靖国元年（1101年）",
      confidence: 1.0,
      location: {
        ancientName: "常州",
        modernName: "江苏省常州市",
        coordinates: [119.974, 31.772],
        precision: "exact",
      },
      title: "北归·终归于寂",
      description:
        `宋徽宗即位大赦，苏轼北归。途经常州时，病逝于此，享年六十六岁。一代文豪，走完了他漂泊的一生。史书记载，其临终说："西天也许有，吾不愿往。"`,
    },
  ],
};
