import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { SliderBox } from 'react-native-image-slider-box';

const SlideShow = () => {
    const [images, setImages] = useState([
        "https://source.unsplash.com/1024x768/?wedding",
        "https://source.unsplash.com/1024x768/?weddingdress",
        "https://source.unsplash.com/1024x768/?bride",
    ]);
    return (
            <SliderBox
                images={images}
                sliderBoxHeight={200}
                // onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                dotColor="#FFEE58"
                inactiveDotColor="#90A4AE"
                paginationBoxVerticalPadding={20}
                autoplay
                circleLoop
                resizeMethod={'resize'}
                resizeMode={'cover'}
                paginationBoxStyle={{
                    position: "absolute",
                    bottom: 0,
                    padding: 0,
                    alignItems: "center",
                    alignSelf: "center",
                    justifyContent: "center",
                    paddingVertical: 10
                }}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 0,
                    padding: 0,
                    margin: 0,
                    backgroundColor: "rgba(128, 128, 128, 0.92)"
                }}
                ImageComponentStyle={{ borderRadius: 15, width: '97%', marginTop: 5 }}
                imageLoadingColor="#2196F3"
            />
    )
}

export default SlideShow