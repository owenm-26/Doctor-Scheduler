import { Button } from "antd";
import { useRouter } from "next/navigation";

const PTButton: React.FC = () => {
  const router = useRouter();

  return (
    <Button onClick={() => router.push("/trainer-selection")}>
      Find a Personal Trainer!
    </Button>
  );
};

export default PTButton;
