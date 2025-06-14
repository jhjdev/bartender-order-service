interface InfoCardProps {
  headline: string;
  text: string | number;
}

const InfoCard = ({ headline, text }: InfoCardProps) => {
  return (
    <>
      <div className="w-full px-4 py-5 bg-white border-cyan-700 border-2 shadow-cyan-700/50 rounded-lg shadow">
        <div className="caption">{headline}</div>
        <div className="h3 mt-1">{text}</div>
      </div>
    </>
  );
};

export default InfoCard;
