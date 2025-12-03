import type { Route } from './+types/_index';
import { Welcome } from '../components/welcome/welcome';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Back Office Schönklinik' },
    { name: 'description', content: 'Sie befinden sich im Back Office' },
  ];
}

export default function Home() {
  return <Welcome />;
}
