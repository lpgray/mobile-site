# 标准企业APP前后端对接讨论

## 概述
咱们的app，可以理解为一个移动端的CMS，主要的部分如下：

- 文章实体
- 图片实体
- 留言回复实体
- 企业历程（时间线）
- 搜索服务(通用服务，可以搜文章、图片等)

基本就这几个主要部分，各个页面需要的数据，可以从这几种来扩充

## 接口需求文档
### 通用接口需求说明
所有的数据接口都以json类型返回，如果接口数据正确，就这样返回：
	
	{
	  r : 1,
	  b : .... // 数据
	}

如果接口错误，就这样返回：
	
	{
	  r : 0,
	  msg : '' // 错误原因
	}


### 首页(可以理解为文章列表加一个图片列表)

**TYPE**

GET

**PARAM**

NULL

**RESP**

	{
		"r" : 1,
		"b" : {
			"carousel" : [
				{"src" : "assets/imgs/fullimage1.jpg", "alias" : "1"},
				{"src" : "assets/imgs/fullimage2.jpg", "alias" : "2"},
				{"src" : "assets/imgs/fullimage3.jpg", "alias" : "3"},
				{"src" : "assets/imgs/fullimage4.jpg", "alias" : "4"},
				{"src" : "assets/imgs/fullimage5.jpg", "alias" : "5"}
			],
			"topnews" : [
				{
				 "id" : 1,
				 "title" : "我司成功与航天局合作",
				 "img" : "assets/imgs/logo5.png",
				 "summary" : "摘要内容"
				}
			]
		}
	}

### 文章列表

**TYPE**

GET

**PARAM**  

	{
	  type : 1, // 文章类型
	  page : 0, // 文章页码
	  size : 10 // 每一页显示的数量
	}

**RESP**

	{
		"r" : 1,
		"b" : {
			"list" : [
				{
					"id" : 1, 
					"title" : "我司与航天局达成合作",
					"img" : "assets/imgs/logo5.png",
					"summary" : ""
				},
				......
			],
			"hasMore" : false //表示还有没有更多的文章
		}
	}

### 文章详情

**TYPE**

GET

**PARAM**

	{
	  id : 1 // 文章id
	}

**RESP**

	{
		"r" : 1,
		"b" : {
			"id" : "1",
			"title" : "我司成功与航天局合作",
			"author" : "官方发布",
			"timestamp" : "2014-04-28 20:10",
			"content" : "" //文章正文，以HTML形式存储，这里有图文混排
		}
	}

### 留言列表
**TYPE**

GET

**PARAM**

NULL

**RESP**

	{
		"r" : 1,
		"b" : [
			{
				"name" : "张先森",
			 	"timestamp" : "4-20 14:30", 
				"content" : "对你们的产品感兴趣"
			}
			.......
		]
	}


### 创建留言
**TYPE**

POST

**PARAM**

	{
		"username" : "昵称",
		"phone" : "电话号码",
		"content" : "留言内容"
	}

**RESP**
	
	{
		"r" : 1
	}

### 产品列表、合作伙伴列表(可以理解为图片列表)
**TYPE**

GET

**PARAM**

	{
		type : 1 // 图片类型
	}

**RESP**
	
	{
		"r" : 1,
		"b" : [
			{
			 "id" : 1,
			 "name" : "苏宁易购客户端", 
			 "img" : "assets/imgs/product.jpg"
			},
			......
		]
	}

### 产品详情(实际上就是文章实体加上一个图片列表)
**TYPE**

GET

**PARAM**
	
	{
		"id" : 1
	}
	

**RESP**

	{
		"r" : 1,
		"b" : {
			"id" : 4,
			"imgs" : [
				{
					"id" : 1,
					"src" : "assets/imgs/product.jpg", "alias" : 1
				},
				....
			],
			"title" : "美丽说客户端",
			"timestamp" : "2014-05-02 09:57",
			"author" : "官方发布",
			"content" : "产品介绍文字"
		}
	}

### 企业历程(时间线)
**TYPE**

GET

**PARAM**

NULL

**RESP**

	{
		"r" : 1,
		"b" : {
			"2012" : [
				{
					"time" : "2012年1月",
					"content" : "内容以html方式存在，可以图文混排"
				},
				{
					"time" : "2012年1月",
					"content" : "内容"
				}
			],
			"2011" : [
				{
					"time" : "2012年1月",
					"content" : "内容"
				},
				{
					"time" : "2012年1月",
					"content" : "内容"
				}
			],
			"2010" : [
				{
					"time" : "2012年1月",
					"content" : "内容"
				},
				{
					"time" : "2012年1月",
					"content" : "内容"
				}
			]
		}
	}