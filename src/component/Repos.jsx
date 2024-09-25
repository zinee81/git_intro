export default function Repos({ repos }) {
  return (
    <li>
      <a href={repos.html_url} target="_blank">
        {repos.name}
      </a>
    </li>
  );
}
