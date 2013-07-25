
window.onload=function(){
  
	var oDoc = document.body;
	 var oParent = document.getElementById('container');
	var oNav = document.getElementById('nav');
	var aNavLi = oNav.getElementsByTagName('li');
	var oRunDom = document.getElementById('main');
	var oHead = document.getElementById('header'); 
	var oPrev = document.getElementById('run_prev');
	var oNext = document.getElementById('run_next');
	var iWidth = oDoc.clientWidth;//获取文档可见区域宽度,其实就是窗口宽度100%
	var iRunDomL = parseInt(getStyle(oRunDom, 'left'));//获取oRunDom的初始left值
	var anim = true;//判断oRunDom是否处于运动
	var iNow = 0;//当前类别索引
	
	//当需要知晓事件详细信息时,需要通过event来操作
	function onMouseWheel(ev)
	{
		//IE直接通过window.event获取事件对象,Firefox需要通过参数传递来获取对象
		var oEvent=ev||event;
		var bDown=true;
		
		//mousewheel事件中event.wheelDelta返回值如果为正则表示鼠标像上滚动,如果为负则表示鼠标向下滚动
		bDown=oEvent.wheelDelta?oEvent.wheelDelta<0:oEvent.detail>0;
		
		//bDown==true则oEvent.wheelDelta<0为true,表示鼠标向下滚,bDown==false即向上滚
		if(bDown)
		{	
			onceRun(iWidth)//表示运动距离为向左iWidth
		}
		else//bDown==false表示鼠标向下滚动
		{	
			onceRun(-iWidth)//表示向右移动距离iWidth
		}
		
		if(oEvent.preventDefault)
		{
			oEvent.preventDefault();//取消事件的默认行为
		}
		
		return false;
	}
	
	//需要获取键盘键值同样需要用到event
	function onKeyDown(ev){
		var oEvent=ev||event;
		//oEvent.keyCode == 39键值为39表示像键盘右键,键值为37表示左键
		if(oEvent.keyCode == 39){
			onceRun(iWidth)//表示向左移动距离iWidth
		}
		else if(oEvent.keyCode == 37){
			onceRun(-iWidth)//表示向右移动距离iWidth
		}
		else{
			return;
		}
	}
	
	//此函数是为左右按钮添加事件而存在,自执行
	(function(){
		oPrev.onclick = function(){//向左按钮点击之后oRunDom向右滚动
		 
			onceRun(-iWidth);
		}
		oNext.onclick = function(){//向右按钮点击之后oRunDom向左滚动
		 
			onceRun(iWidth);
		}
	})();
	
	//onceRun函数为单次运动函数,接受参数s表示运动距离
	function onceRun(oFest){
		//anim==true判断oRunDom不处于运动状态才执行运动
		if(anim){
			
			oFest>0?iNow +=1:iNow -=1;//oFest>0,则表示像左运动,则iNow=iNow+1,否则iNow=iNow-1
			if(iNow<0){
				iNow = 0;
				return false;//阻止oRunDom处于最右时还向右滚动
			}
			else if(iNow>aNavLi.length-1){
				iNow = aNavLi.length-1;
				return false;//阻止oRunDom处于最左时还向左滚动
			}
			
			for(i=0; i<aNavLi.length; i++){
				aNavLi[i].className = '';
			}
			aNavLi[iNow].className = 'active';//重新为当前类别添加高亮样式
			
			anim = false;//anim==false表示当前不能再次进入if(anim)操作
			//startMove为运动函数,通过改变left达到运动效果
			startMove( oRunDom , { left: (iRunDomL - oFest) }, function(){
				//回调函数表示运动结束后执行操作
				//判断左右按钮是否需要隐藏
				iNow == 0?oPrev.style.display = 'none':oPrev.style.display = 'block';
				iNow == aNavLi.length-1?oNext.style.display = 'none':oNext.style.display = 'block';
				anim = true;//anim==true表示此时可以再度进入if(anim)操作
			});	
			iRunDomL = iRunDomL - oFest;//重新为oRunDom赋值left属性值,不将此句放入startMove回调函数中执行是为防止当前运动为执行完成即进入另一个运动中出现bug	
		}
	}
	
	//此函数作用于通过导航操作oRunDom滚动,自执行
	(function(){
		var iIdx = 0;//定义一个iTdx用于存放oRunDom运动单位长度的数量,如运动2个单位长度
		for(var i=0; i<aNavLi.length; i++){
			aNavLi[i].index = i;//将i赋值给aNavLi[i]的索引
			//给所有aNavLi加点击事件
			aNavLi[i].onclick = function(){
				var This = this;//定义一个局部变量用于存放this
				
				//清除所有aNavLi上的高亮样式
				for(i=0; i<aNavLi.length; i++){
					aNavLi[i].className = '';
				}
				
				This.className = 'active';//为当前aNavLi添加高亮样式
				
				//比较点击的aNavLi索引和当前高亮aNavLi的索引值,可以决定oRunDom向左或是向右运动This.index > iNow == true表示点击的栏目处于当前栏目右侧,所以需要向左运动
				if(This.index > iNow){
					iIdx = iNow - This.index;//运动距离为iIdx * iWidth,iIdx为负值向左运动
				}
				else{
					iIdx = iNow - This.index;//运动距离为iIdx * iWidth,iIdx为正值向右运动
				}
				
				iNow = This.index;//重新为当前栏目iNow赋值
				
				//startMove为运动函数,通过改变left达到运动效果
				startMove( oRunDom , { left: (iRunDomL + iIdx * iWidth) },function(){
					//判断左右按钮是否需要隐藏
					iNow == 0?oPrev.style.display = 'none':oPrev.style.display = 'block';
					iNow == aNavLi.length-1?oNext.style.display = 'none':oNext.style.display = 'block';	
				});
				
				iRunDomL = iRunDomL + iIdx * iWidth;//重新为oRunDom赋值left属性值
				anim = true;//此处执行anim = true同样是为了避免单次运动的startMove未执行完成即进入导航控制startMove中时回调函数未执行的情况
			}		
		}
	})();
	//运动部分结束
	//docResize()用于使内容区域垂直居中
	function docResize(){
		var iWinH = oDoc.clientHeight;//iWinH存放当前页面可是窗口高度
		var iParetH = oParent.offsetHeight;//iParetH存放oParent也就是container的初始高度
		var iRunDomH = oRunDom.offsetHeight//iRunDomH存放oRunDom也就是main的高度
		var iHeadH = oHead.offsetHeight;//iHeadH存放oHead也就是header区域的高度
		var iRunDomT = parseInt(getStyle(oRunDom, 'top'));//iRunDomT此处存放的是oRunDom初始top值

		//给oRunDom重新赋值top,使oRunDom可以垂直居中于页面
		oRunDom.style.top = Math.floor(-(iHeadH)) + 'px';
		//为oParent重新分配高度,使之仍然可以包住oRunDom,因为初始iParetH已经包括了初始的iRunDomT,因此需要单独减去

		 oParent.style.height='500px';

		if(iWinH>750){

			oRunDom.style.top = '40px';
			 oParent.style.height = 630+ 'px';//重新为oparent赋值height
   		}
		iWidth = oDoc.clientWidth;
		iNow = 0;
		for(i=0; i<aNavLi.length; i++){
			aNavLi[i].className = '';
		}
		aNavLi[iNow].className = 'active';//重新为当前类别添加高亮样式
		
		anim = false;
		startMove( oRunDom , { left: 0 },function(){
			iNow == 0?oPrev.style.display = 'none':oPrev.style.display = 'block';
			anim = true;
		})
		iRunDomL = 0;
	};
	docResize();//window.onload时执行一次docResize()函数,为初始状态的页面内容区域居中显示
	
	//为oDoc绑定事件
	myAddEvent(oDoc, 'mousewheel', onMouseWheel);
	myAddEvent(oDoc, 'DOMMouseScroll', onMouseWheel);
	myAddEvent(oDoc, 'keydown', onKeyDown);
	myAddEvent(window, 'resize',docResize);
		
	
}
 
