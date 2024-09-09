"use client";
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const StarMap = ({ starData }) => {
  const svgRef = useRef(null);
  const [searchMagnitude, setSearchMagnitude] = useState('');
  let tooltipTimeout = null;

  const zoomToStar = (ra, dec, width, height, zoom) => {
    const svg = d3.select(svgRef.current);
    const projection = d3.geoStereographic()
      .scale(350)
      .rotate([90, -90])
      .clipAngle(90)
      .translate([width / 2, height / 2]);
    
    const [x, y] = projection([ra, dec]);

    svg.transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(4).translate(-x, -y)
      );
  };

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const solarSystem = [{ name: 'Sun', ra: 0, dec: 0, radius: 6, color: 'yellow', magnitude: 4.83 }];

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', '#000000')
      .style('position', 'absolute')
      .style('top', 0)
      .style('left', 0)
      .style('z-index', '-1');

    const projection = d3.geoStereographic()
      .scale(350)
      .rotate([90, -90])
      .clipAngle(90)
      .translate([width / 2, height / 2]);

    const starGroup = svg.append('g');

    const tooltip = d3.select("body").append("div")
      .style("position", "fixed")
      .style("top", "20px")
      .style("right", "300px")
      .style("padding", "10px")
      .style("color", "#1388A2")
      .style("border-radius", "5px")
      .style("display", "none")
      .style("pointer-events", "none");

    const calculateDistance = (ra1, dec1, ra2, dec2) => {
      const rad = (deg) => (deg * Math.PI) / 180;
      const ra1Rad = rad(ra1), ra2Rad = rad(ra2);
      const dec1Rad = rad(dec1), dec2Rad = rad(dec2);

      const sinDecDiff = Math.sin((dec2Rad - dec1Rad) / 2);
      const sinRaDiff = Math.sin((ra2Rad - ra1Rad) / 2);

      const a = sinDecDiff * sinDecDiff + Math.cos(dec1Rad) * Math.cos(dec2Rad) * sinRaDiff * sinRaDiff;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return (c * 180 / Math.PI).toFixed(2);
    };

    starGroup.selectAll('circle.star')
      .data(starData)
      .enter()
      .append('circle')
      .attr('class', 'star')
      .attr('cx', d => {
        const ra = (parseInt(d.RA_hour) * 15) + (parseInt(d.RA_min) * 0.25) + (d.RA_sec / 240);
        return projection([ra, parseFloat(d.dec_deg)])[0];
      })
      .attr('cy', d => {
        const ra = (parseInt(d.RA_hour) * 15) + (parseInt(d.RA_min) * 0.25) + (d.RA_sec / 240);
        return projection([ra, parseFloat(d.dec_deg)])[1];
      })
      .attr('r', d => Math.max(0.3, 12 - parseFloat(d.magnitude)))
      .attr('fill', d => d.imgSrc ? `url(${d.imgSrc})` : `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.8)`)
      .attr('stroke', d =>  `rgba(${Math.random() * 205},${Math.random() * 255},${Math.random() * 255},0.2)`)
      .on('mouseover', (event, d) => {
        const ra = (parseInt(d.RA_hour) * 15) + (parseInt(d.RA_min) * 0.25) + (d.RA_sec / 240);
        const distance = calculateDistance(0, 0, ra, parseFloat(d.dec_deg));

        clearTimeout(tooltipTimeout);

        tooltip.style("display", "block")
          .html(`
            <strong>Constellation:</strong> ${d.constellation}<br>
            <strong>Magnitude:</strong> ${d.magnitude}<br>
            <strong>Distance from Sun:</strong> ${distance}°
          `);
      })
      .on('mouseout', () => {
        tooltipTimeout = setTimeout(() => {
          tooltip.style("display", "none");
        }, 2000);
      })
      .on('click', (event, d) => {
        window.location.href = `/star/${d.magnitude}`;
      });

    starGroup.selectAll('circle.solar-system')
      .data(solarSystem)
      .enter()
      .append('circle')
      .attr('class', 'solar-system')
      .attr('cx', d => projection([d.ra, d.dec])[0])
      .attr('cy', d => projection([d.ra, d.dec])[1])
      .attr('r', d => d.radius)
      .attr('fill', d => d.color)
      .attr('stroke', 'white')
      .on('mouseover', (event, d) => {
        clearTimeout(tooltipTimeout);

        tooltip.style("display", "block")
          .html(`<strong>Object:</strong> ${d.name}`);
      })
      .on('mouseout', () => {
        tooltipTimeout = setTimeout(() => {
          tooltip.style("display", "none");
        }, 2000);
      })
      .on('click', (event, d) => {
        if (d.name === 'Sun') {
          window.location.href = `/star/sun`;
        }
      });

    const zoomBehavior = d3.zoom()
      .scaleExtent([0.5, 8])
      .on('zoom', (event) => {
        starGroup.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    // Ensure zoomBehavior is defined before making it available
    window.zoomBehavior = zoomBehavior;

    return () => {
      svg.selectAll('*').remove();
      tooltip.remove();
    };
  }, [starData]);

  const handleSearch = () => {
    const star = starData.find(star => parseFloat(star.magnitude) === parseFloat(searchMagnitude));
    if (star && window.zoomBehavior) {
      const ra = (parseInt(star.RA_hour) * 15) + (parseInt(star.RA_min) * 0.25) + (star.RA_sec / 240);
      const dec = parseFloat(star.dec_deg);
      const width = window.innerWidth;
      const height = window.innerHeight;
      zoomToStar(ra, dec, width, height, window.zoomBehavior);
    }
  };

  return (
    <div>
     <input
  type="text"
  placeholder="Search by magnitude"
  value={searchMagnitude}
  className='text-white'
  onChange={(e) => setSearchMagnitude(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleSearch();
      // Reset the input after handling the search
      setSearchMagnitude(''); // Clear the input field
    }
  }}
 
  style={{
    position: 'fixed',
    top: '20px',
    right: '10px',
    padding: '10px',
    zIndex: 10,
    backgroundColor: '#000000',
    border: '1px solid #1388A2',
    borderRadius: '5px',
  }}
/>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default StarMap;
