interface InfoCardProps {
  headline: string;
  text: string | number;
}

const SumComponent = ({ headline, text }: InfoCardProps) => {
  return (
    <>
      <div className="w-full px-4 py-5 bg-white border-cyan-700 border-2 shadow-cyan-700/50 rounded-lg shadow">
        <div className="text-sm font-medium text-gray-500 truncate">
          {headline}
        </div>
        <div className="mt-1 text-3xl font-semibold text-gray-900">{text}</div>
      </div>
    </>
  );
};

export default SumComponent;
