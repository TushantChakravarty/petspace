import ImagedCarouselCard from "react-native-imaged-carousel-card";

export const ProfileCard = ({text,uri})=>{
    console.log(uri)
    return(
        <ImagedCarouselCard
  width={150}
  height={200}
  shadowColor="#051934"
  text={text}
  source={{
    uri: `${uri}`,
  }}
/>
    )
}