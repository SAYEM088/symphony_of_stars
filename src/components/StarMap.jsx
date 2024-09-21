"use client";
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { FaSearch } from "react-icons/fa";
import Navbar from './Navbar';

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

  const getStarColor = (bmv) => {
    if (bmv < -0.33) return '#9bb0ff'; 
    if (bmv >= -0.33 && bmv < 0.00) return '#aabfff'; 
    if (bmv >= 0.00 && bmv < 0.30) return '#cad7ff'; 
    if (bmv >= 0.30 && bmv < 0.58) return '#f8f7ff'; 
    if (bmv >= 0.58 && bmv < 0.81) return '#fff4e8'; 
    if (bmv >= 0.81 && bmv < 1.40) return '#ffd2a1'; 
    return '#ffcc6f'; 
  };

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

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
      .style("top", "100px")
      .style("right", "30px")
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
      .attr('cx', d => projection([parseFloat(d.ra), parseFloat(d.dec)])[0])
      .attr('cy', d => projection([parseFloat(d.ra), parseFloat(d.dec)])[1])
      .attr('r', d => Math.max(0.3, 12 - parseFloat(d.st_vmag)))
      .attr('fill', d => getStarColor(parseFloat(d.st_bmv))) 
      .attr('stroke', d => `rgba(${Math.random() * 205},${Math.random() * 255},${Math.random() * 255},0.2)`)
      .on('mouseover', (event, d) => {
        const distance = calculateDistance(0, 0, d.ra, d.dec);

        clearTimeout(tooltipTimeout);

        tooltip.style("display", "block")
          .html(`
            <strong>Star Name:</strong> ${d.star_name}<br>
            <strong>Magnitude:</strong> ${d.st_vmag}<br>
            <strong>Distance from Sun:</strong> ${distance}°<br>
            <strong>Distance (ly):</strong> ${d.st_dist} light years
          `);
      })
      .on('mouseout', () => {
        tooltipTimeout = setTimeout(() => {
          tooltip.style("display", "none");
        }, 5000);
      })
      .on('click', (event, d) => {
        window.location.href = `/star/${d.loc_rowid}`;
      });

    const zoomBehavior = d3.zoom()
      .scaleExtent([0.5, 8])
      .on('zoom', (event) => {
        starGroup.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    window.zoomBehavior = zoomBehavior;

    return () => {
      svg.selectAll('*').remove();
      tooltip.remove();
    };
  }, [starData]);

  const handleSearch = () => {
    const star = starData.find(star => parseFloat(star.st_vmag) === parseFloat(searchMagnitude));
    if (star && window.zoomBehavior) {
      const ra = parseFloat(star.ra);
      const dec = parseFloat(star.dec);
      const width = window.innerWidth;
      const height = window.innerHeight;
      zoomToStar(ra, dec, width, height, window.zoomBehavior);
    }
  };

  return (
    <div>
      <Navbar/>
      
      <input
        type="text"
        placeholder="Search Magnitude"
        value={searchMagnitude}
        style={{
          position: 'fixed',
          top: '20px',
          right: '45px',
          zIndex: 10,
        }}
        className=" px-4 py-2 border border-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setSearchMagnitude(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
            setSearchMagnitude('');
          }
        }}
      />
      <button
      style={{
        position: 'fixed',
        top: '21px',
        right: '45px',
        zIndex: 10,
      }}
        className="px-4 py-2 text-2xl bg-blue-500 rounded-r-full flex items-center justify-center"
        onClick={handleSearch}
      >
        <FaSearch className="text-white" />
      </button>
    
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default StarMap;
