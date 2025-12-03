import type { Route } from './+types/about';


// TODO PROVIDE CONTENT f3de48f9-a7b6-4d4c-ac7a-eb781ebed4dd
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  return (
    <>
      <p>Here we gp</p>
    </>
  );
}
