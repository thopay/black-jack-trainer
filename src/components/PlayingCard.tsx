import CardAssets from "../assets/cards/CardAssets.jsx";

export default function PlayingCard(props: { value: String, type: String, width: Number }) {
  const { value, type } = props;
  let asset_name = type.toLowerCase() + value.toUpperCase();
  if (type.toLocaleLowerCase() === 'flipped') {
    asset_name = 'flipped';
  }
  return (
    <image
      style={{ width: `${props.width}vw`, aspectRatio: 222 / 324 }}
      src={CardAssets[asset_name]}
    />
  );
}