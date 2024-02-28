import { useState } from "react";
import Table, { ColumnProps } from "../components/Table";
import { Vote } from "../hooks/useVotes";
import "./Projects";
import ContestantForm from "../components/Project/ContestantForm";
import useProjectOverviewHook, {
  AdminContestant,
} from "../hooks/useProjectOverviewHook";
import { useParams } from "react-router-dom";
import ProjectSettings from "../components/Project/ProjectSettings";
import extLinkSvg from "../assets/ext-link.svg";
import "./ProjectOverview.css";
import Stats from "./Stats";

const dataVotes: ColumnProps<Vote>[] = [
  { title: "contestantId", key: "contestandId" },
  { title: "Categories", key: "categories" },
  { title: "Ip", key: "publicIpAddress" },
];

const ProjectOverview = () => {
  const [selectedCategorie, setSelectedCategorie] = useState<
    "votes" | "contestants" | "stats"
  >("stats");
  const {
    createContestant,
    contestants,
    deleteContestant,
    project,
    votes,
    error,
    loading,
    connected,
  } = useProjectOverviewHook();
  const { projectId } = useParams();
  const dataContestant: ColumnProps<AdminContestant>[] = [
    {
      title: "Name",
      key: "name",
    },
    { title: "Categories", key: "categories" },
    { title: "Votes", key: "voteCount" },
    { title: "DuplicateVotes", key: "duplicateVoteCount" },
    {
      title: "Delete",
      key: "",
      render(_column, item) {
        return (
          <button className="delete" onClick={() => deleteContestant(item._id)}>
            Delete
          </button>
        );
      },
    },
  ];

  const [displayDuplicateVotes, setDisplayDuplicateVotes] =
    useState<boolean>(true);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredVotes = displayDuplicateVotes
    ? votes
    : votes.filter((v) => !v.duplicateVote);
  return (
    <div>
      <nav>
        <h1>
          {project?.name}:{" "}
          {connected ? (
            <span className="open">Connected</span>
          ) : (
            <span className="closed">Not connected</span>
          )}{" "}
          <a className="extLinkBtn" href={`/${projectId}`}>
            <img src={extLinkSvg} className="extLink" alt="" />
          </a>
        </h1>

        <select
          onChange={(e) =>
            setSelectedCategorie(
              e.target.value as "votes" | "contestants" | "stats"
            )
          }
          value={selectedCategorie}
          className="select"
        >
          <option value="votes">votes</option>
          <option value="contestants">contestant</option>
          <option value="stats">stats</option>
        </select>
      </nav>
      <label htmlFor="">Display double Votes</label>
      <input
        checked={displayDuplicateVotes}
        onChange={() => setDisplayDuplicateVotes(!displayDuplicateVotes)}
        type="checkbox"
        name=""
        id=""
      />
      <div className="split">
        <section>
          {selectedCategorie === "contestants" && (
            <Table data={contestants} columns={dataContestant} />
          )}
          {selectedCategorie === "votes" && (
            <Table data={filteredVotes} columns={dataVotes} />
          )}
          {selectedCategorie === "stats" && (
            <Stats
              displayDuplicateVotes={displayDuplicateVotes}
              contestants={contestants}
            />
          )}
        </section>
        {project && (
          <section>
            <ContestantForm create={createContestant} project={project} />
            <h2>Setting</h2>
            <ProjectSettings project={project} />
          </section>
        )}
      </div>
    </div>
  );
};

export default ProjectOverview;
