interface ProcessNumberProps {
  number: number;
}

export default function ProcessNumber({ number }: ProcessNumberProps) {
  return (
    <span className="home-process-item-number bg-brand-secondary rounded-[50%] w-10 h-10 flex items-center justify-center text-xl font-medium">
      {number}
    </span>
  );
}

