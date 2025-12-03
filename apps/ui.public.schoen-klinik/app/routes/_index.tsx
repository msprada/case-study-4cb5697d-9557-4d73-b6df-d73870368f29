import type { Route } from './+types/_index';
import { Welcome } from '../welcome/welcome';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Schönklinik' },
    { name: 'description', content: 'Sie befinden sich auf dem Portal der Schönklinik' },
  ];
}

export default function Home() {
  return <Welcome />;
}
