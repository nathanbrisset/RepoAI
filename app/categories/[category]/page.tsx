type Props = {
  params: {
    category: string;
  };
};

export default function Page({ params }: Props) {
  return <div>Category: {params.category}</div>;
}