require('normalize.css/normalize.css');
// require('styles/App.css');
require('styles/main.scss');

import React from 'react';

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

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
      	<section className="img-sec">
      		
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
