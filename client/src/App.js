import { Link } from "react-router-dom";
import "./App.scss";

const App = () => {
  return (
    <div className="App">
      <header className="header">
        <h2 className="title">Notion2Confluence</h2>
        <div className="desc">
          Welcome to Notion2Confluence, this app will enable you to migrate your
          Notion pages into Confluence page. Get started by connecting your
          Notion account.
        </div>
      </header>
      <div className="content">
        <a
          href={`https://api.notion.com/v1/oauth/authorize?owner=user&client_id=e174da8d-4f40-4bdb-92b8-7c84614774dc&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fredirect_url&response_type=code`}
          className={sessionStorage.getItem('token_notion') ? "connect-btn connected" : "connect-btn"}
        >
          {
            sessionStorage.getItem('token_notion') ? 'Notion Connected' : 'Connect Notion'
          }
        </a>

        <a
          href={`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=bWbLZng8n40NCBIV9qES4Za9Zp47C3jD&scope=write%3Aconfluence-content%20read%3Aconfluence-space.summary%20write%3Aconfluence-space%20write%3Aconfluence-file%20read%3Aconfluence-props%20write%3Aconfluence-props%20manage%3Aconfluence-configuration%20read%3Aconfluence-content.all%20read%3Aconfluence-content.summary%20search%3Aconfluence%20read%3Aconfluence-content.permission%20read%3Aconfluence-user%20read%3Aconfluence-groups%20write%3Aconfluence-groups%20readonly%3Acontent.attachment%3Aconfluence&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fredirect_url_conf&state=&response_type=code&prompt=consent`}
          className={sessionStorage.getItem('token_conf') ? "connect-btn connected" : "connect-btn"}
        >
          {
            sessionStorage.getItem('token_conf') ? 'Confluence Connected' : 'Connect Confluence'
          }
        </a>

        {
          sessionStorage.getItem('token_notion') && sessionStorage.getItem('token_conf') ? (
            <Link to="dashboard">
              <button className="dashboard-btn">Continue 🡢</button>
            </Link>
          ) : null
        }
      </div>
    </div>
  );
};

export default App;
