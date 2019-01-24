const item = process.argv[2];
const keyword = process.argv[3];
const https = require("https");
const path = require("path");

const { join } = path;
let content = "";
let result_array = [];

const options = {
  "gitee-help": {
    host: "gitee.com",
    path: "/help/load_keywords_data?id=" + encodeURI(keyword) + "&from=alfred-search",
    url: "https://gitee.com/"
  }
}[item];

function getData(handleDataFn) {
  https.get(options, res => {
    res.on("data", chunk => {
        content += chunk;
      }).on("end", () => {
        const jsonContent = JSON.parse(content);
        handleDataFn(jsonContent);
      });
  });
}

function showItem(resultArray) {
  content = "";
  result_array = [];
  console.log(
    JSON.stringify({
      items: resultArray
    })
  );
}

if (item === "gitee-help") {
  getData(jsonContent => {
    const result = jsonContent["data"];
    if(result.length===0){
      result_array.push({
        title: '你搜索的内容暂时找不到啦，试试通过网页查找？',
        subtitle: `https://gitee.com/help/`,
        arg: `https://gitee.com/help/`,
        icon: {
          path: join(__dirname, "/79ADC3CD-8339-45F9-B695-704C56412797.png")
        }
      });
    }
    const { url } = options;
    result.forEach(element => {
      result_array.push({
        title: element.title,
        subtitle: `https://gitee.com${element.href}`,
        arg: `https://gitee.com${element.href}`,
        icon: {
          path: join(__dirname, "/79ADC3CD-8339-45F9-B695-704C56412797.png")
        }
      });
    });
    showItem(result_array);
  });
}
