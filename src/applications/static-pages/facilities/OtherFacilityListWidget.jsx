import React from 'react';
import { apiRequest } from '../../../platform/utilities/api';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import FacilityApiAlert from './FacilityApiAlert';
import { sortFacilitiesByName } from './facilityUtilities';
import FacilityAddress from './FacilityAddress';

export default class OtherFacilityListWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.request = apiRequest(
      `/facilities/va?ids=${this.props.facilities}`,
      null,
      this.handleFacilitiesSuccess,
      this.handleFacilitiesError,
    );
  }

  handleFacilitiesSuccess = facilities => {
    this.setState({
      loading: false,
      facilities: facilities.data,
    });
  };

  handleFacilitiesError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  render() {
    if (this.state.loading) {
      return <LoadingIndicator message="Loading facilities..." />;
    }

    if (this.state.error) {
      return <FacilityApiAlert />;
    }

    const facilitiesList = sortFacilitiesByName(this.state.facilities).map(
      facility => (
        <div
          key={facility.id}
          className="usa-grid-full vads-u-margin-bottom--2p5"
        >
          <section key={facility.id} className="usa-width-one-half">
            <h3 className="vads-u-margin-bottom--2p5">
              <a href={`/find-locations/facility/${facility.id}`}>
                {facility.attributes.name}
              </a>
            </h3>
            <FacilityAddress facility={facility} />
            <div className="vads-u-margin-bottom--1p5">
              <div className="main-phone">
                <strong>Main phone: </strong>
                <a
                  href={`tel:${facility.attributes.phone.main.replace(
                    /[ ]?x/,
                    '',
                  )}`}
                >
                  {facility.attributes.phone.main.replace(/[ ]?x/, '')}
                </a>
              </div>
              <div className="facility-type">
                <p className="vads-u-margin--0">
                  <strong>Facility type:</strong>
                  {` ${facility.attributes.classification}`}
                </p>
              </div>
            </div>
          </section>
        </div>
      ),
    );
    return <div className="locations">{facilitiesList}</div>;
  }
}
