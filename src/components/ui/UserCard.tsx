import { Button, Card, CardHeader, CardBody, CardFooter, Avatar, Progress } from "@heroui/react";

interface UserCardProps {
  name: string;
  username: string;
  avatar: string;
  description: string;
  tags: string;
  starsCount: number;
  maxStars: number;
  globalRank: number;
}

export default function UserCard({
  name,
  username,
  avatar,
  description,
  tags,
  starsCount,
  maxStars,
  globalRank
}: UserCardProps) {
  return (
    <Card className="max-w-[380px] w-full max-h-[90vh] overflow-hidden">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="lg"
            src={avatar}
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-large font-semibold leading-none text-default-600">{name}</h4>
            <h5 className="text-small tracking-tight text-default-400">@{username}</h5>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <svg 
            className="w-12 h-12 text-yellow-500 fill-current" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span className="absolute text-sm font-bold text-black">
            {globalRank}
          </span>
        </div>
      </CardHeader>
      
      <CardBody className="px-3 py-2 text-small text-default-400">
        <p className="mb-2">
          {description}
        </p>
        <span className="pt-1">
          {tags}
        </span>
      </CardBody>
      
      <CardFooter className="gap-3">
        <Progress
          className="max-w-md"
          color="warning"
          label="Мои звезды"
          maxValue={maxStars}
          showValueLabel={true}
          size="sm"
          value={starsCount}
          formatOptions={{style: "decimal"}}
        />
      </CardFooter>
    </Card>
  );
}
