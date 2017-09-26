//几天前的时间戳
function getDaysBefore(m){
    var date = new Date(),
        timestamp, newDate;
    if(!(date instanceof Date)){
        date = new Date(date);
    }
    timestamp = date.getTime();
    newDate = new Date(timestamp - m * 24 * 3600 * 1000);
    return Number(Date.parse(newDate).toString().substring(0,10));
};
//当天零点的时间戳
function todayTimetamp() {
    var start=new Date();
    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(0);
    start.setMilliseconds(0);
    var todayStartTime=Date.parse(start)/1000;
    return todayStartTime
}
var from_ts=Date.parse(new Date(new Date().setHours(0,0,0,0)))/1000;
var to_ts=Date.parse(new Date())/1000;
$('.title .perTime .demo-label input').on('click',function () {
    var _val=$(this).val();
    if (_val=='resize'){
        $('.titTime').show();
    }else {
        if (_val==0){
            from_ts=todayTimetamp();
        }else {
            from_ts=getDaysBefore(_val);
        }
        public_ajax.call_request('get',word_url,wordCloud);
        public_ajax.call_request('get',hotPost_url,hotPost);
        public_ajax.call_request('get',activePost_url,activeUser);
        $('.titTime').hide();
    }
});
//选择时间范围
$('.timeSure').on('click',function () {
    var from = $('.start').val();
    var to = $('.end').val();
    from_ts=Date.parse(new Date(from))/1000;
    to_ts=Date.parse(new Date(to))/1000;
    if (from_ts==''||to_ts==''){
        $('#pormpt p').text('请检查选择的时间（不能为空）');
        $('#pormpt').modal('show');
    }else {
        public_ajax.call_request('get',word_url,wordCloud);
        public_ajax.call_request('get',hotPost_url,hotPost);
        public_ajax.call_request('get',activePost_url,activeUser);
    }
});
//----关键词云
var word_url='/weibo_xnr_monitor/lookup_weibo_keywordstring/?weiboxnr_id='+ID_Num+'&from_ts='+from_ts+'&to_ts='+to_ts;
public_ajax.call_request('get',word_url,wordCloud);
require.config({
    paths: {
        echarts: '/static/js/echarts-2/build/dist',
    }
});
function wordCloud(data) {
    if (data.length==0){
       $('#content-1-word').css({textAlign:"center",lineHeight:"300px",fontSize:'22px'}).text('暂无数据');
    }else {
        var wordSeries=[];
        $.each(data,function (index,item) {
            wordSeries.push(
                {
                    name: item['key'],
                    value: item['doc_count'],
                    itemStyle: createRandomItemStyle()
                }
            )
        });
        require(
            [
                'echarts',
                'echarts/chart/wordCloud'
            ],
            //关键词
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                var myChart = ec.init(document.getElementById('content-1-word'));
                option = {
                    title: {
                        text: '',
                    },
                    tooltip: {
                        show: true
                    },
                    series: [{
                        type: 'wordCloud',
                        size: ['100%', '100%'],
                        textRotation : [0, 0, 0, 0],
                        textPadding: 0,
                        autoSize: {
                            enable: true,
                            minSize: 14
                        },
                        data: wordSeries
                    }]
                };
                myChart.setOption(option);
            }
        );
        $('#content-1-word p').hide();
    }

}
//热门帖子
$('#theme-2 .demo-radio').on('click',function () {
    var classify_id=$(this).val();
    var order_id=$('#theme-3 input:radio[name="demo"]:checked').val();
    var NEWhotPost_url='/weibo_xnr_monitor/lookup_hot_posts/?from_ts='+from_ts+'&to_ts='+to_ts+
        '&weiboxnr_id='+ID_Num+'&classify_id='+classify_id+'&order_id='+order_id;
    public_ajax.call_request('get',NEWhotPost_url,hotPost);
});
$('#theme-3 .demo-radio').on('click',function () {
    var classify_id=$('#theme-2 input:radio[name="demo-radio"]:checked').val();
    var order_id=$(this).val();
    var NEWhotPost_url='/weibo_xnr_monitor/lookup_hot_posts/?from_ts='+from_ts+'&to_ts='+to_ts+
        '&weiboxnr_id='+ID_Num+'&classify_id='+classify_id+'&order_id='+order_id;
    public_ajax.call_request('get',NEWhotPost_url,hotPost);
});
var hotPost_url='/weibo_xnr_monitor/lookup_hot_posts/?from_ts='+from_ts+'&to_ts='+to_ts+
    '&weiboxnr_id='+ID_Num+'&classify_id=0&order_id=1';
public_ajax.call_request('get',hotPost_url,hotPost);
function hotPost(data) {
    $('#hot_post').bootstrapTable('load', data);
    $('#hot_post').bootstrapTable({
        data:data,
        search: true,//是否搜索
        pagination: true,//是否分页
        pageSize: 2,//单页记录数
        pageList: [15,20,25],//分页步进值
        sidePagination: "client",//服务端分页
        searchAlign: "left",
        searchOnEnterKey: false,//回车搜索
        showRefresh: false,//刷新按钮
        showColumns: false,//列选择按钮
        buttonsAlign: "right",//按钮对齐方式
        locale: "zh-CN",//中文支持
        detailView: false,
        showToggle:false,
        sortName:'bci',
        sortOrder:"desc",
        columns: [
            {
                title: "",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    var name,txt,img;
                    if (row.uid==''||row.uid=='null'||row.uid=='unknown'){
                        name='未命名';
                    }else {
                        name=row.uid;
                    };
                    if (row.photo_url==''||row.photo_url=='null'||row.photo_url=='unknown'){
                        img='/static/images/unknown.png';
                    }else {
                        img=row.photo_url;
                    };
                    if (row.text==''||row.text=='null'||row.text=='unknown'){
                        txt='暂无内容';
                    }else {
                        txt=row.text;
                    };
                    var str=
                        '<div class="post_perfect" style="margin: 20px auto;width:920px;">'+
                        '   <div class="post_center-hot">'+
                        '       <img src="'+img+'" alt="" class="center_icon">'+
                        '       <div class="center_rel">'+
                        '           <a class="center_1" href="###" style="color: #f98077;">'+name+'</a>&nbsp;'+
                        '           <i class="mid" style="display: none;">'+row.mid+'</i>'+
                        '           <i class="uid" style="display: none;">'+row.uid+'</i>'+
                        '           <i class="timestamp" style="display: none;">'+row.timestamp+'</i>'+
                        '           <span class="time" style="font-weight: 900;color:blanchedalmond;"><i class="icon icon-time"></i>&nbsp;&nbsp;'+getLocalTime(row.timestamp)+'</span>  '+
                        '           <span class="center_2">'+txt+'</span>'+
                        '           <div class="center_3">'+
                        '               <span class="cen3-1" onclick="retweet(this)"><i class="icon icon-share"></i>&nbsp;&nbsp;转发</span>'+
                        '               <span class="cen3-2" onclick="showInput(this)"><i class="icon icon-comments-alt"></i>&nbsp;&nbsp;评论</span>'+
                        '               <span class="cen3-3" onclick="thumbs(this)"><i class="icon icon-thumbs-up"></i>&nbsp;&nbsp;赞</span>'+
                        '               <span class="cen3-4" onclick="focusThis(this)"><i class="icon icon-heart-empty"></i>&nbsp;&nbsp;关注该用户</span>'+
                        '               <span class="cen3-5" onclick="joinlab(this)"><i class="icon icon-signin"></i>&nbsp;&nbsp;加入语料库</span>'+
                        '           </div>'+
                        '           <div class="commentDown" style="width: 100%;display: none;">'+
                        '               <input type="text" class="comtnt" placeholder="评论内容"/>'+
                        '               <span class="sureCom" onclick="comMent(this)">评论</span>'+
                        '           </div>'+
                        '       </div>'+
                        '    </div>'+
                        '</div>';
                    return str;
                }
            },
        ],
    });
    $('#hot_post p').hide();
    $('.hot_post .search .form-control').attr('placeholder','输入关键词快速搜索相关微博（回车搜索）');
}
//活跃用户
$('#user-1 .demo-radio').on('click',function () {
    var classify_id=$('#user-1 input:radio[name="deadio"]:checked').val();
    var NEWactivePost_url='/weibo_xnr_monitor/lookup_active_weibouser/?weiboxnr_id='+ID_Num+'&classify_id='+classify_id+
    '&start_time='+from_ts+'&end_time='+to_ts;
    public_ajax.call_request('get',NEWactivePost_url,activeUser);
});
var activePost_url='/weibo_xnr_monitor/lookup_active_weibouser/?weiboxnr_id='+ID_Num+
    '&start_time='+from_ts+'&end_time='+to_ts+'&classify_id=1';
public_ajax.call_request('get',activePost_url,activeUser);
var act_user_list=[];
function activeUser(persondata) {
    $('.userList #userList').bootstrapTable('load', persondata);
    $('.userList #userList').bootstrapTable({
        data:persondata,
        search: true,//是否搜索
        pagination: true,//是否分页
        pageSize: 5,//单页记录数
        pageList: [15,20,25],//分页步进值
        sidePagination: "client",//服务端分页
        searchAlign: "left",
        searchOnEnterKey: false,//回车搜索
        showRefresh: false,//刷新按钮
        showColumns: false,//列选择按钮
        buttonsAlign: "right",//按钮对齐方式
        locale: "zh-CN",//中文支持
        detailView: false,
        showToggle:false,
        sortName:'bci',
        sortOrder:"desc",
        columns: [
            {
                title: "添加关注",//标题
                field: "select",
                checkbox: true,
                align: "center",//水平
                valign: "middle"//垂直
            },
            {
                title: "头像",//标题
                field: "photo_url",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    if (row.photo_url==''||row.photo_url=='null'||row.photo_url=='unknown'||!row.photo_url){
                        return '<img style="width: 20px;height: 20px;" src="/static/images/unknown.png"/>';
                    }else {
                        return '<img style="width: 20px;height: 20px;" src="'+row.photo_url+'"/>';
                    };
                }
            },
            {
                title: "用户ID",//标题
                field: "id",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                // formatter: function (value, row, index) {
                //     return row[1];
                // }
            },
            {
                title: "昵称",//标题
                field: "nick_name",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    if (row.nick_name==''||row.nick_name=='null'||row.nick_name=='unknown'){
                        return '无昵称';
                    }else {
                        return row.nick_name;
                    };
                }
            },
            {
                title: "注册地",//标题
                field: "user_location",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    if (row.user_location==''||row.user_location=='null'||row.user_location=='unknown'){
                        return '未知';
                    }else {
                        return row.user_location;
                    };
                }
            },
            {
                title: "粉丝数",//标题
                field: "fansnum",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
            },
            {
                title: "微博数",//标题
                field: "weibo_count",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    if (row.weibo_count==''||row.weibo_count=='null'||row.weibo_count=='unknown'||!row.weibo_count){
                        return '0';
                    }else {
                        return row.weibo_count;
                    };
                }
            },
            {
                title: "影响力",//标题
                field: "influence",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    if (row.influence==''||row.influence=='null'||row.influence=='unknown'||!row.influence){
                        return '0';
                    }else {
                        return row.influence.toFixed(2);
                    };
                }
            },
            // {
            //     title: "网民详情",//标题
            //     field: "",//键名
            //     sortable: true,//是否可排序
            //     order: "desc",//默认排序方式
            //     align: "center",//水平
            //     valign: "middle",//垂直
            //     formatter: function (value, row, index) {
            //         return '<span style="cursor: pointer;" onclick="networkPeo(\''+row.id+'\')" ' +
            //             'title="查看详情"><i class="icon icon-link"></i></span>'
            //     },
            // },
        ],
        onCheck:function (row) {
            act_user_list.push(row.id);_judge()
        },
        onUncheck:function (row) {
            act_user_list.removeByValue(row.id);_judge()
        },
        onCheckAll:function (row) {
            act_user_list.push(row.id);_judge()
        },
        onUncheckAll:function (row) {
            act_user_list.removeByValue(row.id);_judge()
        },
    });
    $('#userList p').hide();
}
function _judge() {
    if (act_user_list.length==0){
        $('.userList .addFocus').addClass('disableCss');
    }else {
        $('.userList .addFocus').removeClass('disableCss');
    }
}
$('.userList .addFocus').on('click',function () {
    var add_url='/weibo_xnr_monitor/attach_fans_batch/?xnr_user_no_list='+ID_Num+'&fans_id_list='+act_user_list.join(',');
    public_ajax.call_request('get',add_url,postYES);
})
//-------------------颜色----------------------
function createRandomItemStyle() {
    return {
        normal: {
            color: 'rgb(' + [
                Math.round(Math.random() * 260),
                Math.round(Math.random() * 260),
                Math.round(Math.random() * 260)
            ].join(',') + ')'
        }
    };
}
//加入语料库  data-toggle="modal" data-target="#wordcloud"
function joinWord() {
    var create_type=$('#wordcloud input:radio[name="xnr"]:checked').val();
    var corpus_type=$('#wordcloud input:radio[name="theday"]:checked').val();
    var theme_daily_name=[],tt='';
    if (corpus_type=='主题语料'){tt=2};
    $("#wordcloud input:checkbox[name='theme"+tt+"']:checked").each(function (index,item) {
        theme_daily_name.push($(this).val());
    });
    var corpus_url='/weibo_xnr_monitor/addto_weibo_corpus/?corpus_type='+corpus_type+'&theme_daily_name='+theme_daily_name.join(',')+'&text='+text+
        '&uid='+uid+'&mid='+mid+'&retweeted='+retweeted+'&comment='+comment+'&like=0&create_type='+create_type;
    public_ajax.call_request('get',corpus_url,postYES);
}
//查看网民详情
function networkPeo(_id) {
    var detail_url='/weibo_xnr_monitor/weibo_user_detail/?user_id='+_id;
    public_ajax.call_request('get',detail_url,networkPeoDetail);
}
function networkPeoDetail(data) {
    console.log(data)
}

//评论
function showInput(_this) {
    $(_this).parents('.post_perfect').find('.commentDown').show();
};
function comMent(_this){
    var txt = $(_this).prev().val();
    var mid = $(_this).parents('.post_perfect').find('.mid').text();
    if (txt!=''){
        var post_url_3='/weibo_xnr_monitor/get_weibohistory_comment/?text='+txt+'&xnr_user_no='+ID_Num+'&r_mid='+mid;
        public_ajax.call_request('get',post_url_3,postYES)
    }else {
        $('#pormpt p').text('评论内容不能为空。');
        $('#pormpt').modal('show');
    }
}

//转发
function retweet(_this) {
    var txt = $(_this).parent().prev().text();
    var mid = $(_this).parents('.post_perfect').find('.mid').text();
    var post_url_2='/weibo_xnr_monitor/get_weibohistory_retweet/?&xnr_user_no='+ID_Num+
        '&text='+txt+'&r_mid='+mid;
    public_ajax.call_request('get',post_url_2,postYES)
}

//点赞
function thumbs(_this) {
    var mid = $(_this).parents('.post_perfect').find('.mid').text();
    var uid = $(_this).parents('.post_perfect').find('.uid').text();
    var timestamp = $(_this).parents('.post_perfect').find('.timestamp').text();
    var txt = $(_this).parent().prev().text();
    var post_r_s_url='/weibo_xnr_monitor/get_weibohistory_like/?xnr_user_no='+ID_Num+'&r_mid='+mid+
        '&uid='+uid+'&nick_name='+REL_name+'&timestamp='+timestamp+'&text='+txt;
    console.log(post_r_s_url)
    public_ajax.call_request('get',post_r_s_url,postYES)
};

//关注该用户
function focusThis(_this) {
    var uid = $(_this).parents('.post_perfect').find('.uid').text();
    var post_url_6='/weibo_xnr_monitor/attach_fans_follow/?xnr_user_no='+ID_Num+'&uid='+uid;
    public_ajax.call_request('get',post_url_6,postYES)
}

//加入语料库
var wordUid,wordMid,wordTxt,wordRetweeted,wordComment;
function joinlab(_this) {
    wordMid = $(_this).parents('.post_perfect').find('.mid').text();
    wordUid = $(_this).parents('.post_perfect').find('.uid').text();
    wordTxt = $(_this).parents('.post_perfect').find('.center_2').text();
    wordRetweeted = $(_this).parents('.post_perfect').find('.forwarding').text();
    wordComment = $(_this).parents('.post_perfect').find('.comment').text();
    $('#wordcloud').modal('show');
}
function joinWord() {
    var create_type=$('#wordcloud input:radio[name="xnr"]:checked').val();
    var corpus_type=$('#wordcloud input:radio[name="theday"]:checked').val();
    var theme_daily_name=[],tt='11';
    if (corpus_type=='主题语料'){tt=22};
    $("#wordcloud input:checkbox[name='theme"+tt+"']:checked").each(function (index,item) {
        theme_daily_name.push($(this).val());
    });
    var corpus_url='/weibo_xnr_monitor/addto_weibo_corpus/?corpus_type='+corpus_type+'&theme_daily_name='+theme_daily_name.join(',')+
        '&text='+wordTxt+ '&uid='+wordUid+'&mid='+wordMid+'&retweeted='+wordRetweeted+'&comment='+wordComment+
        '&like=0&create_type='+create_type;
    public_ajax.call_request('get',corpus_url,postYES);
}

//操作返回结果
function postYES(data) {
    var f='';
    if (data[0]||data||data[0][0]){
        f='操作成功';
    }else {
        f='操作失败';
    }
    $('#pormpt p').text(f);
    $('#pormpt').modal('show');
}