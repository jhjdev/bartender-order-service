interface CardProps {
  customerNumber: string;
  drinkCount?: number;
  drinkType: string;
}

const CardComponent = ({
  customerNumber,
  drinkType,
  drinkCount,
}: CardProps) => {
  return (
    <div className="rounded-lg">
      <div className="justify-center center-items">
        <div className="max-w-md rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300">
          <div className="rounded-[calc(1.5rem-1px)] p-10 bg-white">
            <div className="flex gap-4 items-center">
              <p>
                <span className="text-slate-950 dark:text-slate-950">
                  Customer Number:{" "}
                </span>
                <span className="text-green-500">{customerNumber}</span> <br />
                <span className="text-slate-950 dark:text-slate-950">
                  Quantity:{" "}
                </span>
                <span className="text-green-500">{drinkCount}</span> <br />
                <span className="text-slate-950 dark:text-slate-950">
                  Drink Type:{" "}
                </span>
                <span className="text-green-500">{drinkType}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
