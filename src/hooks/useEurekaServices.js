import { useState, useEffect } from 'react';
import axios from 'axios';
import { EUREKA_SERVER_URL } from '../config/config';

const useEurekaServices = () => {
  const [services, setServices] = useState({});

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(EUREKA_SERVER_URL);
        const applications = response.data.applications.application;

        const serviceMap = applications.reduce((acc, app) => {
          const instances = app.instance;
          const serviceUrls = instances.reduce((serviceAcc, instance) => {
            serviceAcc[app.name] = instance.homePageUrl;
            return serviceAcc;
          }, {});
          return { ...acc, ...serviceUrls };
        }, {});

        setServices(serviceMap);
      } catch (error) {
        console.error('Error fetching services from Eureka:', error);
      }
    };

    fetchServices();
  }, []);

  return services;
};

export default useEurekaServices;
