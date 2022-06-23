$(function () {
	searchFunc("/search.xml", "my-custom-inp", "my-custom-content");

	function searchFunc(path, search_id, content_id) {
		"use strict";
		// var BTN = "<button type='button' class='local-search-close' id='local-search-close'></button>";
		var BTN = "";
		$.ajax({
			url: path,
			dataType: "xml",
			success: function (xmlResponse) {
				// get the contents from search data
				var datas = $("entry", xmlResponse)
					.map(function () {
						return {
							title: $("title", this).text(),
							content: $("content", this).text(),
							url: $("url", this).text(),
						};
					})
					.get();

				var $input = document.getElementById(search_id);
				var $resultContent = document.getElementById(content_id);

				$input.addEventListener("input", function () {
					var str = '<ul class="search-result-list">';
					var keywords = this.value.trim().toLowerCase().split(/[\s]+/);
					$resultContent.innerHTML = "";
					if (this.value.trim().length <= 0) {
						return;
					}
					// perform local searching
					datas.forEach(function (data) {
						var isMatch = true;
						// var content_index = [];
						if (!data.title || data.title.trim() === "") {
							data.title = "Untitled";
						}
						var data_title = data.title.trim().toLowerCase();
						var data_content = data.content
							.trim()
							.replace(/<[^>]+>/g, "")
							.toLowerCase();
						var data_url = data.url;
						var index_title = -1;
						var index_content = -1;
						var first_occur = -1;
						// only match artiles with not empty contents
						if (data_content !== "") {
							keywords.forEach(function (keyword, i) {
								index_title = data_title.indexOf(keyword);
								index_content = data_content.indexOf(keyword);

								if (index_title < 0 && index_content < 0) {
									isMatch = false;
								} else {
									if (index_content < 0) {
										index_content = 0;
									}
									if (i == 0) {
										first_occur = index_content;
									}
									// content_index.push({index_content:index_content, keyword_len:keyword_len});
								}
							});
						} else {
							isMatch = false;
						}
						// show search results
						if (isMatch) {
							str +=
								"<li><a href='" +
								data_url +
								"' class='search-result-title'>" +
								data_title +
								"</a>";
							var content = data.content.trim().replace(/<[^>]+>/g, "");
							if (first_occur >= 0) {
								// cut out 100 characters
								var start = first_occur - 20;
								var end = first_occur + 80;

								if (start < 0) {
									start = 0;
								}

								if (start == 0) {
									end = 100;
								}

								if (end > content.length) {
									end = content.length;
								}

								var match_content = content.substring(start, end);

								// highlight all keywords
								keywords.forEach(function (keyword) {
									var regS = new RegExp(keyword, "gi");
									match_content = match_content.replace(
										regS,
										"<strong><em style='color:red;padding:0 5px' class=\"search-keyword\">" +
											keyword +
											"</em></strong>"
									);
								});

								str += '<p class="search-result">' + match_content + "...</p>";
							}
							str += "</li>";
						}
					});
					str += "</ul>";
					if (str.indexOf("<li>") === -1) {
						return ($resultContent.innerHTML =
							BTN +
							'<div class="search-result-empty"><p><i class="fe fe-tired"></i> 没有找到内容，更换下搜索词试试吧~<p></div>');
					}
					$resultContent.innerHTML = BTN + str;
				});
			},
		});
		$(document).on("click", "#local-search-close", function () {
			$("#local-search-input").val("");
			$("#local-search-result").html("");
		});
	}

	class Scrolloption {
		conwra = document.getElementById("my-custom-wra"); //要在content内部滚动，而页面不受影响，所以这里获取要滚动的对象
		content = document.getElementById("my-custom-content");
    inp = document.getElementById("my-custom-inp")
		firefox = navigator.userAgent.indexOf("Firefox") != -1;
    delta = 0
    location = 0
    maxheight = 0
		init() {
      if(this.firefox){
        this.conwra.addEventListener("DOMMouseScroll", this.MouseWheel.bind(this), { passive: false })
      }else{
        this.conwra.onmousewheel = this.MouseWheel.bind(this)
      }
      this.inp.oninput = this.handleInpChange.bind(this)
      
		}
		MouseWheel(e) {
			//阻止事件冒泡和默认行为的完整兼容性代码
      if (e.stopPropagation) {//这是取消冒泡
          e.stopPropagation();
      } else{
          e.cancelBubble = true;
      };

			if (e.preventDefault) {
				//这是取消默认行为，要弄清楚取消默认行为和冒泡不是一回事
				e.preventDefault();
			} else {
				e.returnValue = false;
			}

			if (e.wheelDelta) {
				//IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
				this.delta = e.wheelDelta / 120;
				if (window.opera) this.delta = - this.delta; //因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
			} else if (e.detail) {
				//FF浏览器使用的是detail,其值为“正负3”
				this.delta = -e.detail / 3;
			}

      this.maxheight = (1 - (  this.conwra.clientHeight /  this.content.clientHeight)  ) * 100
      this.handleScroll(this.delta,this.maxheight)
			return false;
		}
    handleScroll(value,max){
      // this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight;

      this.location += value > 0 ?  -10 :  10
      if(this.location >= max){
        this.location = max
      }else if(this.location <= 0){
        this.location = 0
      }

      this.content.style.transform = `translateY(${- this.location}%)`
    }
    showScrollbar(){
      var scrollbar = document.createElement("div");
			scrollbar.style = {
				width: "10px",
				height: "100%",
				position: "absolute",
				right: 0,
				top: 0,
        backgroundColor:'red'
			};

			var innerScrollbar = document.createElement("div");
			innerScrollbar.style = {
				width: "8px",
				height: (this.conwra.clientHeight * 100) / this.content.clientHeight,
				margin: "0 auto",
			};

			scrollbar.appendChild(innerScrollbar);
      this.conwra.remove()
			this.conwra.appendChild(scrollbar);
    }
    handleInpChange(){
      this.handleScroll(1,0)
      // if(this.conwra.clientHeight < this.content.clientHeight){
      //   this.showScrollbar()
      // }
    }
	}

	var myscroll = new Scrolloption();
	myscroll.init();


	
});
