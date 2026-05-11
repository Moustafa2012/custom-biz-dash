import type { Article } from "@/types"
import { t } from "@/lib/translations"

const defaultArticles: Article[] = [
  {
    title: t("حمية البحر الأبيض المتوسط وصحة القلب والأوعية الدموية", "Mediterranean Diet: Scientific Evidence for Heart Health"),
    desc: t(
      "تحليل شامل للأدلة العلمية يظهر أن النظام الغذائي المتوسطي يقلل بشكل كبير من مخاطر الإصابة بأمراض القلب التاجية والسكتة الدماغية وأمراض القلب والأوعية الدموية بشكل عام.",
      "Comprehensive analysis of scientific evidence shows that the Mediterranean diet significantly reduces the risk of coronary heart disease, stroke, and cardiovascular diseases in large longitudinal cohorts across Mediterranean and non-Mediterranean populations."
    ),
    category: t("صحة القلب", "Heart Health"),
    date: t("18 ديسمبر 2025", "December 18, 2025"),
    readTime: t("8 دقائق", "8 min"),
    featured: true,
    author: t("مارتينيز-غونزاليس وآخرون", "Martinez-González et al."),
    publisher: "Cardiovascular Research",
    journal: "Cardiovascular Research",
    doi: "10.1093/cvr/cvae256",
    publishDate: "2025-12-18",
    heroImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=600&fit=crop",
    authorImage: "https://ui-avatars.com/api/?name=Martinez+Gonzalez&background=random",
    tags: ["mediterranean", "heart_health", "diet", "cardiovascular"],
    fullContent: t(
      `النظام الغذائي المتوسطي: دليل علمي شامل لصحة القلب

يُعدّ النظام الغذائي المتوسطي من أكثر الأنماط الغذائية دراسةً في تاريخ علم التغذية. وقد تراكمت الأدلة العلمية على مدى عقود لتثبت فائدته الكبيرة في الحماية من أمراض القلب والأوعية الدموية.

المكونات الرئيسية للنظام المتوسطي

يقوم هذا النظام على تناول كميات وفيرة من الخضراوات والفواكه والحبوب الكاملة والبقوليات، مع استخدام زيت الزيتون البكر الممتاز مصدرًا أساسيًا للدهون. كما يتضمن استهلاكًا معتدلًا من الأسماك والدواجن ومنتجات الألبان، في حين يُقلِّل من اللحوم الحمراء والمعالجة.

الأدلة العلمية

كشفت دراسة PREDIMED، وهي من أكبر التجارب السريرية العشوائية في هذا المجال، أن اتباع النظام المتوسطي المدعّم بزيت الزيتون أو المكسرات يُخفِّض خطر الإصابة بالأحداث القلبية الوعائية الكبرى بنسبة تصل إلى 30% مقارنةً بالنظام الغذائي المنخفض الدهون.

فضلًا عن ذلك، أثبتت دراسات المتابعة طويلة الأمد أن الالتزام بهذا النظام يرتبط بانخفاض ملحوظ في مستويات الكوليسترول الضار LDL، وتحسّن في حساسية الأنسولين، وتراجع في مؤشرات الالتهاب كالبروتين التفاعلي C.

الآليات البيولوجية

تُسهم الأحماض الدهنية الأحادية غير المشبعة الغنية بها، ولا سيما حمض الأوليك، في الحفاظ على مرونة الأوعية الدموية. كما تعمل مضادات الأكسدة الموجودة في زيت الزيتون البكر، من هيدروكسيتيروسول وأوليوكانثال، على الحدّ من الأكسدة وتثبيط الالتهاب.

التوصيات السريرية

في ضوء هذه الأدلة الراسخة، باتت كبرى الجمعيات القلبية العالمية، كالجمعية الأمريكية للقلب والجمعية الأوروبية لأمراض القلب، تُوصي بالنظام المتوسطي نمطًا غذائيًا أساسيًا للوقاية من أمراض القلب والأوعية الدموية.`,
      `The Mediterranean Diet: A Comprehensive Scientific Guide for Heart Health

The Mediterranean diet is among the most extensively studied dietary patterns in nutritional science history. Evidence accumulated over decades robustly supports its cardioprotective benefits.

Core Components

The diet is characterized by abundant plant foods including vegetables, fruits, whole grains, legumes, and nuts; extra-virgin olive oil as the primary fat source; moderate consumption of fish, poultry, and dairy; and limited red and processed meat intake.

Scientific Evidence

The landmark PREDIMED trial — one of the largest randomized controlled trials on dietary patterns — demonstrated that a Mediterranean diet supplemented with extra-virgin olive oil or mixed nuts reduced the risk of major cardiovascular events by approximately 30% compared to a low-fat control diet.

Long-term cohort studies consistently show Mediterranean diet adherence is associated with significantly lower LDL cholesterol, improved insulin sensitivity, and reduced circulating inflammatory markers including C-reactive protein and interleukin-6.

Biological Mechanisms

The diet's high monounsaturated fatty acid content, particularly oleic acid, supports vascular endothelial function and arterial elasticity. Polyphenols in extra-virgin olive oil — hydroxytyrosol, oleuropein, and oleocanthal — exert antioxidant and anti-inflammatory effects through multiple molecular pathways.

Clinical Recommendations

Based on the strength of this evidence, major cardiovascular societies including the American Heart Association and European Society of Cardiology now formally recommend the Mediterranean dietary pattern as a first-line approach for cardiovascular disease prevention.`
    ),
  },
  {
    title: t("الميكروبيوم المعوي: التقدم الرئيسي في صحة الأمعاء", "The Gut Microbiome: Key Advances in Gut Health"),
    desc: t(
      "تسلط أحدث الأبحاث الضوء على العلاقة الحاسمة بين تنوع بكتيريا الأمعاء والصحة البدنية والعقلية، مع تطورات كبيرة في العلاجات المبنية على الميكروبيوم.",
      "Latest research highlights the critical relationship between gut bacteria diversity and physical and mental health, with significant developments in microbiome-based therapies."
    ),
    category: t("صحة الأمعاء", "Gut Health"),
    date: t("28 يناير 2025", "January 28, 2025"),
    readTime: t("7 دقائق", "7 min"),
    featured: false,
    author: t("فريق Gut Microbiota for Health", "GMFH Research Team"),
    publisher: "GMFH Publishing",
    journal: "Gut Microbiota for Health",
    publishDate: "2025-01-28",
    heroImage: "https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=1200&h=600&fit=crop",
    authorImage: "https://ui-avatars.com/api/?name=GMFH+Team&background=random",
    tags: ["microbiome", "gut_health", "bacteria", "immunity"],
    fullContent: t(
      `ميكروبيوم الأمعاء: تقدم رئيسي في علم صحة الأمعاء

شهدت السنوات الأخيرة قفزة نوعية في فهمنا لميكروبيوم الأمعاء ودوره المحوري في الصحة الإنسانية. يضم هذا النظام البيئي المعقد ما يزيد على 100 تريليون كائن دقيق، تتوزع على أكثر من ألف نوع بكتيري مختلف.

التنوع الميكروبي ومؤشر الصحة

تشير الأدلة المتراكمة إلى أن تنوع الميكروبيوم يُعدّ مؤشرًا صحيًا بالغ الأهمية. فالأفراد الذين يتمتعون بميكروبيوم أكثر تنوعًا يُظهرون، في العموم، مناعة أقوى وتمثيلًا غذائيًا أفضل وصحة نفسية أكثر استقرارًا.

محور الأمعاء-الدماغ

كشفت الأبحاث الحديثة عن محور تواصل ثنائي الاتجاه بين الأمعاء والدماغ، يعمل عبر العصب المبهم والناقلات العصبية وجهاز المناعة. وقد وثّقت دراسات عديدة وجود ارتباط وثيق بين التغيرات في تركيبة الميكروبيوم وأعراض الاكتئاب والقلق.

التطورات العلاجية

حقق زرع الميكروبيوم البرازي نجاحات باهرة في علاج عدوى المطثية العسيرة المتكررة، وبلغت نسب الشفاء 90% في بعض التجارب. كما تمضي الأبحاث في اتجاه البروبيوتيك المصمم هندسيًا وراثيًا لعلاج حالات أمراض الأمعاء الالتهابية والسكري من النوع الثاني ومتلازمة القولون العصبي.

التأثير الغذائي على الميكروبيوم

يتأثر الميكروبيوم بشكل جذري بالنظام الغذائي؛ إذ يُعزز الغذاء الغني بالألياف نمو البكتيريا النافعة كالبيفيدوبكتيريوم والفيكاليباكتيريوم. في المقابل، يرتبط الاستهلاك المفرط للسكريات المكررة والدهون المتشبعة بانخفاض حاد في التنوع الميكروبي.`,
      `The Gut Microbiome: Key Advances in Gut Health Science

Recent years have witnessed a quantum leap in our understanding of the gut microbiome and its pivotal role in human health. This complex ecosystem harbors over 100 trillion microorganisms spanning more than a thousand bacterial species.

Microbial Diversity as a Health Indicator

Accumulating evidence positions microbiome diversity as a critical health marker. Individuals with more diverse gut microbiomes generally exhibit stronger immune responses, better metabolic profiles, and more stable mental health outcomes.

The Gut-Brain Axis

Contemporary research has revealed a bidirectional communication axis between the gut and brain, operating through the vagus nerve, neurotransmitter synthesis, and immune signaling. Multiple studies have documented robust associations between microbiome compositional shifts and symptoms of depression and anxiety.

Therapeutic Advances

Fecal microbiota transplantation has demonstrated remarkable success in treating recurrent Clostridioides difficile infections, achieving cure rates above 90% in some trials. Research is advancing toward engineered probiotics targeting inflammatory bowel disease, type 2 diabetes, and irritable bowel syndrome.

Dietary Modulation

Diet profoundly shapes microbiome composition. Fiber-rich diets selectively promote beneficial genera including Bifidobacterium and Faecalibacterium. Conversely, excess refined sugars and saturated fats are consistently linked to reduced microbial diversity and increased gut permeability.`
    ),
  },
  {
    title: t("التأثير طويل المدى للنظام الغذائي المتوسطي على الوقاية من أمراض القلب", "Long-term Impact of Mediterranean Diet on Heart Disease Prevention"),
    desc: t(
      "تحليل تلوي شامل للتجارب السريرية العشوائية يؤكد أن النظام الغذائي المتوسطي يقلل بشكل كبير من الأحداث القلبية الوعائية الرئيسية والنوبات القلبية والسكتات الدماغية.",
      "A comprehensive meta-analysis of randomized clinical trials confirms that the Mediterranean diet significantly reduces major cardiovascular events, heart attacks, and strokes."
    ),
    category: t("تغذية علاجية", "Therapeutic Nutrition"),
    date: t("1 مارس 2024", "March 1, 2024"),
    readTime: t("9 دقائق", "9 min"),
    featured: false,
    author: t("سباستيان، بادا، وجوهال", "Sebastian, Bada, and Johal"),
    publisher: "Current Problems in Cardiology",
    journal: "Current Problems in Cardiology",
    doi: "10.1016/j.cpcardiol.2024.102509",
    publishDate: "2024-03-01",
    heroImage: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=1200&h=600&fit=crop",
    authorImage: "https://ui-avatars.com/api/?name=Sebastian+Bada&background=random",
    tags: ["research", "clinical_trials", "prevention", "meta_analysis"],
    fullContent: t(
      `التحليل التلوي: التأثيرات طويلة المدى للنظام الغذائي المتوسطي في الوقاية من أمراض القلب

يُقدّم هذا التحليل التلوي الشامل تقييمًا معمّقًا لأدلة التجارب السريرية العشوائية حول التأثيرات القلبية الوعائية طويلة الأمد للنظام الغذائي المتوسطي. وقد اشتمل التحليل على 28 تجربة مؤهلة، شارك فيها ما يزيد على 52,000 مشارك بفترات متابعة تراوحت بين سنتين وعشر سنوات.

المنهجية

خضعت الدراسات المُدرجة لبروتوكول انتقاء صارم يشترط: التصميم العشوائي المضبوط، ووضوح تعريفات النتائج القلبية الوعائية، وفترة متابعة لا تقل عن سنتين. وشملت النتائج الأولية احتشاء عضلة القلب والسكتة الدماغية والوفيات الناجمة عن أمراض القلب والأوعية الدموية.

النتائج الجوهرية

كشف التحليل عن:
• انخفاض بنسبة 28% في خطر احتشاء عضلة القلب (فترة الثقة 95%: 19-36%)
• تراجع بنسبة 24% في خطر السكتة الدماغية (فترة الثقة 95%: 14-33%)
• انخفاض بنسبة 20% في الوفيات القلبية الوعائية (فترة الثقة 95%: 11-28%)
• تحسّن واضح في مجمل مؤشرات عوامل الخطر القلبي الوعائي

التغايرية والمحدِّدات

وُجدت درجة مقبولة من التغايرية بين الدراسات، عُزيت أساسًا إلى اختلافات في تعريف النظام الغذائي وخصائص المجتمعات محل الدراسة. وكانت الفوائد أكثر وضوحًا في الأفراد ذوي الخطر القلبي المرتفع.

الخلاصة

تُعزّز هذه النتائج بشكل قاطع الأدلة الداعمة للنظام الغذائي المتوسطي نمطًا غذائيًا فعّالًا في الوقاية الأولية والثانوية من أمراض القلب والأوعية الدموية.`,
      `Meta-Analysis: Long-Term Effects of Mediterranean Diet on Cardiovascular Disease Prevention

This comprehensive meta-analysis provides a rigorous evaluation of randomized clinical trial evidence for the long-term cardiovascular effects of the Mediterranean dietary pattern. The analysis included 28 eligible trials encompassing over 52,000 participants with follow-up periods ranging from 2 to 10 years.

Methodology

Included studies met strict eligibility criteria: randomized controlled design, clearly defined cardiovascular outcomes, and minimum 2-year follow-up duration. Primary outcomes included myocardial infarction, stroke, and cardiovascular mortality.

Key Findings

The analysis revealed:
• 28% reduction in myocardial infarction risk (95% CI: 19-36%)
• 24% reduction in stroke risk (95% CI: 14-33%)
• 20% reduction in cardiovascular mortality (95% CI: 11-28%)
• Significant improvements across composite cardiovascular risk factor profiles

Heterogeneity and Moderators

Moderate heterogeneity was present, attributable primarily to variation in dietary definition and population characteristics across studies. Benefits were most pronounced in high-risk cardiovascular populations.

Conclusion

These findings decisively strengthen the evidence base supporting the Mediterranean dietary pattern as an effective approach for both primary and secondary prevention of cardiovascular disease.`
    ),
  },
  {
    title: t("الميكروبات الشخصية: بصمة فريدة للصحة", "Personal Microbiomes: A Unique Health Fingerprint"),
    desc: t(
      "دراسة ستانفورد الطبية تكشف أن الميكروبيوم الفريد لكل شخص هو الأكثر استقرارًا، مما يوفر رؤى جديدة حول الصحة الفردية والعلاجات الشخصية.",
      "A Stanford Medical study reveals that each person's unique microbiome is the most stable, offering new insights into individual health and personalized treatments."
    ),
    category: t("صحة عامة", "General Health"),
    date: t("12 مارس 2024", "March 12, 2024"),
    readTime: t("6 دقائق", "6 min"),
    featured: false,
    author: t("تشو، سنايدر وفريق البحث", "Zhou, Snyder and Research Team"),
    publisher: "Cell Host & Microbe",
    journal: "Cell Host & Microbe",
    publishDate: "2024-03-12",
    heroImage: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=1200&h=600&fit=crop",
    authorImage: "https://ui-avatars.com/api/?name=Zhou+Snyder&background=random",
    tags: ["personalized_medicine", "biomarkers", "longitudinal_study", "stanford"],
    fullContent: t(
      `الميكروبيوم الشخصي: بصمة صحية فريدة لكل فرد

قادت جامعة ستانفورد الطبية دراسةً مرجعيةً شاملة، رصدت فيها ميكروبيوم الأمعاء والفم والأنف والجلد لدى 86 مشاركًا على امتداد ست سنوات متواصلة، لتكشف نتائجها عن حجم الخصوصية الشخصية في تركيبة الميكروبيوم وفائدتها الكبيرة في الطب الدقيق.

التصميم والمنهجية

استُخدم في هذه الدراسة نهج متعدد الطبقات الأوميكية، يجمع بين التسلسل الجيني والبروتيوميكس والميتابولوميكس، لرسم صورة بيولوجية متكاملة لكل مشارك. وقد أُجريت جلسات أخذ العينات في فترات منتظمة، مما أتاح تتبع التغيرات الديناميكية عبر الزمن.

استقرار الميكروبيوم

تمثّل الاكتشاف الأبرز في أن الميكروبيوم الشخصي يحتفظ بتوقيع مميز ومستقر عبر الزمن، يفوق في ثباته غيره من مؤشرات الصحة الحيوية. وقد أُمكن التعرف على معظم الأفراد من خلال ميكروبيوم أحد مواقع أجسامهم بدقة تراوحت بين 86% و97%.

التطبيقات السريرية

تعد هذه النتائج بآفاق واسعة في مجالات عدة: رصد الأمراض وتتبعها مع مرور الوقت، وتفسير تباين الاستجابة الفردية للعلاجات المختلفة، وتطوير تدخلات شخصية متخصصة في الميكروبيوم، علاوة على تعميق فهمنا للعلاقة بين الميكروبيوم وأمراض معقدة كالسكري والأمراض الالتهابية المزمنة.

التوجهات المستقبلية

يُخطط الباحثون لتوسيع نطاق الدراسة لتشمل شرائح سكانية أكثر تنوعًا، والتحقيق في آليات التغيرات الطولية التي يحدثها الغذاء والمرض على الميكروبيوم.`,
      `Personal Microbiomes: A Unique Health Fingerprint

Stanford Medical led a landmark longitudinal study tracking gut, oral, nasal, and skin microbiomes of 86 participants across six years, revealing remarkable personal specificity and stability with profound implications for precision medicine.

Study Design and Methods

The study employed a multi-omic approach integrating genomic sequencing, proteomics, and metabolomics to construct comprehensive biological portraits. Sampling was performed at regular intervals, enabling dynamic temporal tracking.

Microbiome Stability

The central finding was that each person's microbiome maintains a distinctive, stable signature over time — more stable than many other health biomarkers. Most individuals could be correctly identified from a single body site's microbiome with 86–97% accuracy.

Clinical Implications

These findings open promising avenues for disease monitoring and longitudinal tracking, explaining individual variation in treatment responses, developing targeted microbiome interventions, and deepening understanding of microbiome relationships with complex diseases including diabetes and chronic inflammatory conditions.

Future Directions

Researchers plan to expand the cohort to more diverse populations and investigate mechanisms underlying longitudinal changes driven by diet, illness, and life events.`
    ),
  },
]

const STORAGE_KEY = "articles_data"

function loadArticles(): Article[] {
  if (typeof window === "undefined") return defaultArticles
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return defaultArticles
}

function saveArticles(articles: Article[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
  } catch {}
}

export let articles: Article[] = loadArticles()

export function addArticle(article: Article) {
  articles = [article, ...articles]
  saveArticles(articles)
}

export function updateArticle(index: number, article: Article) {
  articles = articles.map((a, i) => (i === index ? article : a))
  saveArticles(articles)
}

export function deleteArticle(index: number) {
  articles = articles.filter((_, i) => i !== index)
  saveArticles(articles)
}

export function resetArticles() {
  articles = defaultArticles
  saveArticles(articles)
}