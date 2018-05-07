import { Component } from 'preact';
import data from '../valeri-hristov-career-data';

export default class Summary extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <div className="container pb-5">
        <div className="row p-4">
          <div className="col-3">
            <img src="./assets/me.jpg" className="img-fluid img-thumbnail my-pic" />
          </div>
          <div className="col-9">
            <ul class="list-group">
              <li class="list-group-item">{data.name}</li>
              <li class="list-group-item">{data.position}</li>
              <li class="list-group-item">{data.email}</li>
              <li class="list-group-item">{data.phone}</li>
              <li class="list-group-item">{data.location}</li>
            </ul>
          </div>
        </div>
        <div className="mt-3">
          <h4>About me</h4>
          <p class="lead">
            {data.summary}
          </p>
        </div>
        <div className="mt-3">
          <h4>Other interests</h4>
          <p class="lead">
            {data.aboutMyPersonality}
          </p>
        </div>
        <div>
          <h4>Knowledge areas</h4>
          {data.knowledgeAreas.sort((a, b) => b.level - a.level).map(ka => {
            const style = `width: ${(ka.level / 10) * 100}%`;
            return <div className="mb-2">
              <h6>{ka.name}</h6>
              <div class="progress">
                <div class="progress-bar" role="progressbar" aria-valuenow="5" style={style} aria-valuemin="0" aria-valuemax="10"></div>
              </div>
            </div>
          })}
        </div>
        <div className="mt-5">
          <h4>Technologies</h4>
          {data.technologies.sort((a, b) => b.level - a.level).map(ka => {
            const style = `width: ${(ka.level / 10) * 100}%`;
            return <div className="mb-2">
              <h6>{ka.name}</h6>
              <div class="progress">
                <div class="progress-bar" role="progressbar" aria-valuenow="5" style={style} aria-valuemin="0" aria-valuemax="10"></div>
              </div>
            </div>
          })}
        </div>
        <div className="mt-5">
          <h4>Frameworks used</h4>
          <ul>
            {data.usedFrameworks.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
        <div className="mt-5">
          <h4>Development environments</h4>
          <ul>
            {data.devEnvironments.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
        <div className="mt-5">
          <h4>Education</h4>
          <div className="row">
            {data.education.map(e => {
              return <div className="card col-3 mr-3">
                <img class="card-img-top" src={e.img} alt="Card image cap" />
                <div class="card-body">
                  <h5 class="card-title">{e.name}</h5>
                  <p class="card-text">{e.duration}</p>
                </div>
              </div>
            })}
          </div>
        </div>
        <div className="mt-5">
          <h4>Work Experience</h4>
          <div className="row">
            {data.workExperience.map(w => {
              return <div className="card col-8 mb-3">
                <div class="card-body">
                  <h5 class="card-title"><strong>{w.position}</strong></h5>
                  <p class="card-text">{w.duration}</p>
                  <p class="card-text"><strong>{w.company}</strong></p>
                  <p class="card-text">{w.summary}</p>
                  <ul>
                    {w.technologies.map(t => <li>{t}</li>)}
                  </ul>
                </div>
              </div>
            })}
          </div>
        </div>
        <p class="lead mt-5 text-center pb-5">
            Thank you for reviewing my work, if you would like to work together, please contact me! :)
          </p>
      </div>
    )
  }

}