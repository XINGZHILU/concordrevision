function rank_string(rank: number) {
  if (4 <= rank && rank <= 19) {
    return `${rank}th`
  }
  else if (rank % 10 === 1) {
    return `${rank}st`
  }
  else if (rank % 10 === 2) {
    return `${rank}nd`
  }
  else if (rank % 10 === 3) {
    return `${rank}rd`
  }
  return `${rank}th`;
}

export default async function QS_Info({ university }: {
  university: {
    name: string
  }
}) {
  const url = `https://api.gugudata.io/v1/metadata/global-university-ranking?appkey=${process.env.QS_API_KEY}&name=${university.name}&pageIndex=1&pageSize=10`;
  const response = await fetch(url, {
    method: 'GET',
  });
  if (!response.ok) {
    return <p>Information unavailable</p>;
  }
  const info = await response.json();
  if (info.data === null) {
    return <p>Information unavailable</p>;
  }
  if (info.data.length === 0) {
    return <p>Information unavailable</p>;
  }
  const details = info.data[0];

  return (<div>
    <h3>Location</h3>
    <p>{details.city}, {details.country}</p>
    <h3>QS Rankings</h3>
    <table>
      <tr>
        <th>Overall ranking</th>
        <td>{rank_string(details.rank)}</td>
      </tr>
      <tr>
        <th>Academic reputation score</th>
        <td>{details.academicReputationScore} ({rank_string(details.academicReputationRank)})</td>
      </tr>
      <tr>
        <th>Citations per faculty score</th>
        <td>{details.citationsPerFacultyScore} ({rank_string(details.citationsPerFacultyRank)})</td>
      </tr>
      <tr>
        <th>Faculty-student ratio score</th>
        <td>{details.facultyStudentRatioScore} ({rank_string(details.facultyStudentRatioRank)})</td>
      </tr>
      <tr>
        <th>Employer reputation score</th>
        <td>{details.employerReputationScore} ({rank_string(details.employerReputationRank)})</td>
      </tr>
      <tr>
        <th>Employment outcomes score</th>
        <td>{details.employmentOutcomesScore} ({rank_string(details.employmentOutcomesRank)})</td>
      </tr>
      <tr>
        <th>International student ratio score</th>
        <td>{details.internationalStudentRatioScore} ({rank_string(details.internationalStudentRatioRank)})</td>
      </tr>
      <tr>
        <th>International research network score</th>
        <td>{details.internationalResearchNetworkScore} ({rank_string(details.internationalResearchNetworkRank)})</td>
      </tr>
      <tr>
        <th>International faculty ratio score</th>
        <td>{details.internationalFacultyRatioScore} ({rank_string(details.internationalFacultyRatioRank)})</td>
      </tr>
      <tr>
        <th>Sustainability score</th>
        <td>{details.sustainabilityScore} ({rank_string(details.sustainabilityRank)})</td>
      </tr>
    </table>
  </div>);
}