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
  totalUsers: number;
}

export default function UserCard({
  name,
  username,
  avatar,
  description,
  tags,
  starsCount,
  maxStars,
  globalRank,
  totalUsers
}: UserCardProps) {
  return (
    <Card className="max-w-[380px] w-full max-h-[90vh] overflow-hidden mx-auto">
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
        <div className="text-sm font-bold text-default-600">
          ⭐ {starsCount.toLocaleString()}
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
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-default-600">
              Рейтинг
            </span>
            <span className="text-sm font-bold text-default-600">
              # {globalRank.toLocaleString()}
            </span>
          </div>
          <Progress
            className="max-w-md"
            color="warning"
            maxValue={totalUsers}
            size="sm"
            value={totalUsers - globalRank + 1}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
