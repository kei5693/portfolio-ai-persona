/*
    vue-clipboard2 및 kakaoPlugin을 사용해야 사용할수 있음
    Vue 객체 또한 window.getApp으로 등록이 되어 있어야 함.
*/
export default [
    {
        name: 'SHARE_EVENT_COPY_URL',
        callback: function (data) {
            if (!data.url) { console.error("url 값이 없습니다."); return; }

            window.getApp.$copyText(data.url).then(function (e) {
                console.log(e)
            }, function (e) {
                console.log(e)
            });
            if (data.callback) {
                data.callback();
            }
        }
    },
    {
        name: 'SHARE_EVENT_SEND_KAKAO',
        callback: function (data) {
            if (!data.title) { console.error("title 값이 없습니다."); return; }
            if (!data.desc) { console.error("desc 값이 없습니다."); return; }
            if (!data.url) { console.error("url 값이 없습니다."); return; }
            window.getApp.$kakao.Link.sendCustom({
                templateId: 58682,
                templateArgs: {
                    thumb: "https://www.affde.com/uploads/article/18271/PYoJ8l12ofd8wJZp.jpg",
                    contentTitle: data.title,
                    contentDesc: data.desc,
                    btnTitle: "컨텐츠 보러가기",
                    path: data.url // 도메인 이후의 경로값
                }
            })
            if (data.callback) {
                data.callback();
            }
        }
    },
];
