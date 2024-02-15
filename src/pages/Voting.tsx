import useContestant from "../hooks/useContestant";
import SelectGender from "../components/Voting/SelectGender";
import Voted from "../components/Voting/Voted";
import SelectContestant from "../components/Voting/SelectContestant";
import "./Voting.css";

const Voting = () => {
  const {
    display,
    renderData,
    selectedGender,
    selectedMale,
    selectedFemale,
    votedFemale,
    votedMale,
    vote,
    setSelectedGender,
    selectContestant,
  } = useContestant();

  function renderButton() {
    return (
      (selectedGender === "m" && selectedMale && !votedMale) ||
      (selectedGender === "f" && selectedFemale && !votedFemale)
    );
  }

  function isSelected(contestantId: string) {
    return (
      (selectedGender === "m" && selectedMale?._id === contestantId) ||
      (selectedGender === "f" && selectedFemale?._id === contestantId)
    );
  }
  if (display === "banned")
    return <div className="voted-c">Already voted from this device.</div>;
  return (
    <>
      <button
        onClick={() => {
          localStorage.clear();
        }}
      >
        Reset
      </button>
      <nav className="container">
        <h1>Ballkönig/-in</h1>
      </nav>
      <section className="container">
        <SelectGender
          gender={selectedGender}
          setGender={(gender) => setSelectedGender(gender)}
        />
        <SelectContestant
          isSelected={isSelected}
          renderData={renderData}
          selectContestant={selectContestant}
        />
        {selectedGender === "m" && votedMale && selectedMale && (
          <Voted name={selectedMale?.name} />
        )}
        {selectedGender === "f" && votedFemale && selectedFemale && (
          <Voted name={selectedFemale.name} />
        )}
      </section>
      <footer className="container">
        {renderButton() && (
          <div>
            <p>Änderung der Wahl nicht möglich.</p>
            <button onClick={vote}>Final Abstimmen</button>
          </div>
        )}
      </footer>
    </>
  );
};

export default Voting;
