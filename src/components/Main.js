require('normalize.css/normalize.css');
// require('styles/App.css');
require('styles/main.scss');

import React from 'react';
import ReactDOM from 'react-dom'

// 获取图片相关json数据
let imageDatas = require('sources/imageDatas.json')

/*
	图片信息添加url地址
	输入图片json数据，返回已添加url的json
*/
imageDatas = (function getImageUrl(imageDatasArr){
	for(let i=0,j=imageDatasArr.length;i<j;i++){
		let singleImage = imageDatasArr[i];

		singleImage.url = require('../images/'+singleImage.filename)

		imageDatasArr[i] = singleImage
	}

	return imageDatasArr
})(imageDatas)

/*
* 获取区间内的任意值
*/
function getRangeRandom(low,high){
	return Math.round(Math.random() * (high - low) + low)
}

/*
*  获取一个0-30的正负角度
*/
function getDegRandom(){
	return (Math.random() > 0.5 ? " ":"-") + Math.random() * 30;
}


// 图片单个展示的组件
class ImgFigure extends React.Component{
	/*
	* 处理figure点击事件
	*/
	handleClick=(e)=>{
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	}

	render(){
		let styleObj = {};

		// 如果props中有指定位置信息，则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos
		}
		// 如果照片的旋转角度有值且不为0，添加旋转角度
		if(this.props.arrange.rotate){
			// (['-moz-','-webkit-','-ms-','']).forEach((value)=>{
				styleObj['transform'] = "rotate("+this.props.arrange.rotate+"deg)";
			// })
		}

		if(this.props.arrange.isCenter){
			styleObj.zIndex = 11
		}

		let imgFigureClassName = "img-figure";
		imgFigureClassName += this.props.arrange.isInverse ? " is-inverse" : " ";
		return(
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.url}
							alt={this.props.data.title}
				/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		)
	}
}

class AppComponent extends React.Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	imgsArrangeArr:[
	  		/*pos:{
	  			top:0,
	  			left:0
	  		},
	  		rotate:0, //旋转角度
	  		isInverse:false,  //正反面
	  		isCenter:false,  // 是否居中
	  		*/
	  	]
	  };
	}

	Constant={
		centerPos:{
			left:0,
			right:0
		},
		hPosRange:{ //水平方向取值范围
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		vPosRange:{ //垂直方向取值范围
			x:[0,0],
			topY:[0,0]
		}
	}

	/*
	* 翻转图片
	* @param 输入当前执行inverse的图片的index
	* @return {function}
	*/
	inverse=(index)=>{
		return function(){
			let imgsArrangeArr = this.state.imgsArrangeArr;

			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse
			this.setState({
				imgsArrangeArr:imgsArrangeArr
				})
		}.bind(this);
	}

	/*
	* 重新布局所有图片
	* @param centerIndex 指定居中哪个图片
	*/
	rearrange=(centerIndex)=>{
		let imgsArrangeArr = this.state.imgsArrangeArr,
				Constant = this.Constant,
				centerPos = Constant.centerPos,
				hPosRange = Constant.hPosRange,
				vPosRange = Constant.vPosRange,
				hPosRangeLeftSecX = hPosRange.leftSecX,
				hPosRangeRightSecX = hPosRange.rightSecX,
				hPosRangeY = hPosRange.y,
				vPosRangeTopY = vPosRange.topY,
				vPosRangeX = vPosRange.x,
				imgsArrangeTopArr = [],
				topImgNum = Math.round(Math.random() * 2), // 上侧图片有0-2个

				topImgSpliceIndex = 0,//用来标记放在上部的图片是数组中的哪个

				imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);  //获取居中图片的信息

		// 首先居中centerIndex的图片
		imgsArrangeCenterArr[0] ={
			pos:centerPos,
			rotate:0,
			isInverse:false,
			isCenter:true
		}
		// 取出要布置在上侧的图片的状态信息
		topImgSpliceIndex = Math.round(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

		//布局位于上侧的函数
		imgsArrangeTopArr.forEach((value,index)=>{
			imgsArrangeTopArr[index]={
				pos:{
					top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
				},
				rotate:getDegRandom(),
				isInverse:false,
				isCenter:false
			}
		})

		// 布局两侧的图片
		for(let i=0,j=imgsArrangeArr.length,k= j / 2 ; i<j ; i++){
			let hPosRangeLORX = null;

			// 前半部分在左边，后半部分在右边
			if(i<k){
				hPosRangeLORX = hPosRangeLeftSecX
			}else{
				hPosRangeLORX = hPosRangeRightSecX
			}

			imgsArrangeArr[i] = {
				pos:{
					top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
					left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
				},
				rotate:getDegRandom(),
				isInverse:false,
				isCenter:false
			}
		}


		// 把之前取出的上侧图片塞回去
		if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
			imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0])
		}

		// 把放置中心的图片放回去
		imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

		// 更新state触发更新
		this.setState({
			imgsArrangArr:imgsArrangeArr
		})

	}

	/*
	* 居中图片 
	* @param 输入图片的index
	* @return {function}
	*/
	center=(index)=>{
		return function(){
			this.rearrange(index);
		}.bind(this)
	}

	// 组件加载后为每张图片计算位置
	componentDidMount(){
		//获取舞台大小
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
				stageW = stageDOM.scrollWidth,
				stageH = stageDOM.scrollHeight,
				halfStageW = Math.round(stageW / 2),
				halfStageH = Math.round(stageH / 2);

		//那道一个imgFigure的DOM节点
		let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
				imgW = imgFigureDOM.scrollWidth,
				imgH = imgFigureDOM.scrollHeight,
				halfImgW = Math.round(imgW / 2 ),
				halfImgH = Math.round(imgH /2 );

		//计算中心图片的位置点
		this.Constant.centerPos={
			left:halfStageW - halfImgW,
			top:halfStageH - halfImgH
		}

		//计算左右侧图片布局范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		//计算上侧图片布局范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW ;

		let randomIndex = Math.round(Math.random() * 16);
		this.rearrange(randomIndex)
	}

  render() {

  	let controllersUnits=[],
  			ImgFigures=[];

  	imageDatas.forEach((value,index)=>{
  		if(!this.state.imgsArrangeArr[index]){
  			this.state.imgsArrangeArr[index] = {
  				pos:{
  					left:0,
  					top:0
  				},
  				rotate:0,
  				isInverse:false,
  				isCenter:false
  			}
  		}

  		ImgFigures.push(
  			<ImgFigure 
  				data={value}
  				ref={'imgFigure'+index}
	  			arrange={this.state.imgsArrangeArr[index]}
	  			inverse={this.inverse(index)}
	  			center={this.center(index)}
	  			/>
  			)
  	})

    return (
      <section className="stage" ref="stage">
      	<section className="img-sec">
      		{ImgFigures}
      	</section>

      	<nav className="contriller-nav">
      		
      	</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
