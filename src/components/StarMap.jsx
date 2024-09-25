"use client";
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { FaSearch } from "react-icons/fa";
import Navbar from './Navbar';

const StarMap = ({ starData }) => {
  const svgRef = useRef(null);
  const [searchHIP, setSearchHIP] = useState('');
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
        clearTimeout(tooltipTimeout);

        tooltip.style("display", "block")
          .html(`
            <strong>Star Name:</strong> ${d.star_name}<br>
            <strong>HIP Name:</strong> ${d.hip_name}<br>
            <strong>Distance (ly):</strong> ${d.st_dist} light years
          `);
      })
      .on('mouseout', () => {
        tooltipTimeout = setTimeout(() => {
          tooltip.style("display", "none");
        }, 5000);
      })
      .on('click', (event, d) => {
        window.location.href = `/star/${d.hip_name}`;
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
    const star = starData.find(star => star.hip_name === searchHIP);
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
        placeholder="Search by HIP Name"
        value={searchHIP}
        style={{
          position: 'fixed',
          top: '20px',
          right: '45px',
          zIndex: 10,
        }}
        className=" px-4 py-2 border border-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setSearchHIP(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
            setSearchHIP('');
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
      <footer style={{ position: 'absolute', bottom: 0, width: '20%', background: 'rgba(0, 0, 0, 0.01)', color: 'white', padding: '10px', zIndex: 10 }}>
        <p>&copy; API Source: <a href=" https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=missionstars" target="_blank">NASA </a></p>
       
      </footer>
    </div>
  );
};

export default StarMap;
