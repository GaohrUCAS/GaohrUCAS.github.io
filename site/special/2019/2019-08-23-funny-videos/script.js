var videos_1 = [
	{"id":"000", "title":"1岁的年龄，30岁的表情，40岁的眼睛，<br>50岁的神情，60岁的头发，70岁的动作，<br>坐着90岁的轮椅"},
	{"id":"001", "title":"2018年沙雕视频合集，看一次笑一次！！！"},
	{"id":"002", "title":"2019年最佳BGM出炉了，<br>哈哈哈哈哈毫无违和感"},
	{"id":"003", "title":"What happend?"},
	{"id":"004", "title":"安检"},
	{"id":"005", "title":"别人的早上 VS 我的早上"},
	{"id":"006", "title":"大鹅也是很厉害的，<br>不过碰到了大爷算它倒霉"},
	{"id":"007", "title":"当我和朋友在网上看到沙雕段子<br>和沙雕网友的时候"},
	{"id":"008", "title":"地铁秀恩爱合集，来自单身狗的表情包。。。"},
	{"id":"009", "title":"第一次看见雪的动物们，太呆萌了！！！"},
	{"id":"010", "title":"哈哈哈哈哈哈哈哈<br>这是什么新型沙雕"},
	{"id":"011", "title":"好魔性的视频，简直看得停不下来"},
	{"id":"012", "title":"尖叫鸡版权游主题曲"},
	{"id":"013", "title":"开口说话的喵星人"},
	{"id":"014", "title":"老鼠：我不想玩... 鹦鹉：不，你想"},
	{"id":"015", "title":"凌晨2点的我想起4个月前自己讲的一个笑话"},
	{"id":"016", "title":"流畅，自信，迷人，优雅，<br>完美的计算，落地的质感"},
	{"id":"017", "title":"吕秀才与精灵王子"},
	{"id":"018", "title":"猫：为了一口吃的"},
	{"id":"019", "title":"猫老婆突然回来，猫小三见状立刻逃走"},
]
var videos_2 = [
	{"id":"020", "title":"莫名其妙的鸭子"},
	{"id":"021", "title":"那些动物教给我们的道理，快进来学习"},
	{"id":"022", "title":"生活中的那些沙雕动物"},
	{"id":"023", "title":"谁都逃不过真香定律哈哈哈哈哈"},
	{"id":"024", "title":"所以说“专业动作，请勿模仿”"},
	{"id":"025", "title":"她不给我吃，你赶快骂她骂她"},
	{"id":"026", "title":"突如其来的莫西干发型"},
	{"id":"027", "title":"推上一位小哥说，<br>自己的猫突然冲进房间对自己说..."},
	{"id":"028", "title":"万物皆可supreme"},
	{"id":"029", "title":"汪星人搞笑视频集锦，有些狗子蠢到家了"},
	{"id":"030", "title":"一只海鸠的完美着陆。<br>场面一度尴尬，请你们当做没看见"},
	{"id":"031", "title":"神级鬼畜，川普奥巴马"},
	{"id":"032", "title":"这球，这鞋...跟我过不去咋的"},
	{"id":"033", "title":"真·全自动鸭刷[允悲]"},
	{"id":"034", "title":"真是一只硬核的小羊"},
	{"id":"035", "title":"最蠢翻译官"},
	{"id":"036", "title":"做作业全凭想象力合集，<br>哈哈哈，真是伤透脑"},
	{"id":"037", "title":"6个月大的胖橘猫跳到台上的样子"},
	{"id":"038", "title":"敢抢我吃的，头都给你打飞"},
	{"id":"039", "title":"哈哈哈哈不要顶狗了"},
]
// 打乱数组
function randomsort(a, b) {
    return Math.random()>.5 ? -1 : 1;
    //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
}

var index = new Array()
for(k = 0; k < 20; k++) {
	index.push(k)
}
index.sort(randomsort);

for(i = 0; i < 20; i++) {
	$("#video-list-1").append("<div class=\"video-div\">" +
								"<p>" + videos_1[index[i]].title + "</p>" +
								"<video controls>" +
									"<source src=\"https://gaohr-blog.oss-cn-beijing.aliyuncs.com/videos/funny/" + videos_1[index[i]].id + ".mp4\" type='video/mp4'>" +
								"</video>" +
							"</div>");
	$("#video-list-2").append("<div class=\"video-div\">" +
								"<p>" + videos_2[index[i]].title + "</p>" +
								"<video controls>" +
									"<source src=\"https://gaohr-blog.oss-cn-beijing.aliyuncs.com/videos/funny/" + videos_2[index[i]].id + ".mp4\" type='video/mp4'>" +
								"</video>" +
							"</div>");
}	