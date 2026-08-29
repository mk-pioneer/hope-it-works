/**
 * SICP Jharkhand - Leaflet 2.0.0-alpha Impact Map Component
 * 
 * Technical Implementation Notes for Leaflet 2.0.0-alpha:
 * 1. Factory methods (L.map, L.marker, etc.) are removed in 2.0-alpha; constructors are used.
 * 2. ESM-first architecture: direct named imports from 'leaflet'.
 * 3. StrictMode Protection: Cleans container `_leaflet_id` and map instances to prevent double-mount crashes.
 * 4. Resilient Fallback: If any Leaflet initialization issue occurs, automatically falls back to vector GIS.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map, TileLayer, Marker, DivIcon, Popup, LayerGroup } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { JharkhandVectorMap } from './JharkhandVectorMap';

export const LeafletImpactMap = ({
  problems = [],
  selectedProblemId = null,
  onSelectProblem,
  onOpenStoryModal,
  zoomLevel = 1,
  setZoomLevel
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const markersMapRef = useRef(new Map());

  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [useVectorFallback, setUseVectorFallback] = useState(false);

  // 1. Helper to render markers and clusters based on current zoom
  const renderLayers = useCallback((map, layerGroup) => {
    if (!map || !layerGroup) return;

    try {
      layerGroup.clearLayers();
      markersMapRef.current.clear();

      const currentZoom = map.getZoom();
      const CLUSTER_ZOOM_THRESHOLD = 8.5;

      if (currentZoom < CLUSTER_ZOOM_THRESHOLD) {
        // --- CLUSTERED MODE ---
        const clusters = {};

        problems.forEach((prob) => {
          if (!prob.coordinates?.lat || !prob.coordinates?.lng) return;
          const region = prob.clusterRegion || 'Other';
          if (!clusters[region]) {
            clusters[region] = {
              name: region,
              items: [],
              totalLat: 0,
              totalLng: 0
            };
          }
          clusters[region].items.push(prob);
          clusters[region].totalLat += prob.coordinates.lat;
          clusters[region].totalLng += prob.coordinates.lng;
        });

        Object.values(clusters).forEach((cluster) => {
          const count = cluster.items.length;
          if (count === 0) return;

          const centerLat = cluster.totalLat / count;
          const centerLng = cluster.totalLng / count;
          const resolvedCount = cluster.items.filter(p => p.status === 'Resolved').length;

          const clusterIcon = new DivIcon({
            className: 'custom-leaflet-cluster-icon',
            html: `
              <div style="cursor: pointer;" class="relative group">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: #0f172a; border: 2px solid #34d399; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(16,185,129,0.5);">
                  <span style="font-size: 13px; font-weight: 800; color: #6ee7b7; font-family: monospace;">${count}</span>
                  <span style="font-size: 8px; text-transform: uppercase; color: #cbd5e1; font-weight: 700; margin-top: -2px;">Impacts</span>
                </div>
                <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); background: #020617; padding: 1px 6px; border-radius: 9999px; border: 1px solid #334155; font-size: 8px; font-weight: 700; color: #34d399; white-space: nowrap;">
                  ${resolvedCount} ✓
                </div>
              </div>
            `,
            iconSize: [48, 48],
            iconAnchor: [24, 24]
          });

          const clusterMarker = new Marker([centerLat, centerLng], { icon: clusterIcon });

          clusterMarker.on('click', () => {
            map.flyTo([centerLat, centerLng], 9.5, { duration: 0.8 });
          });

          layerGroup.addLayer(clusterMarker);
        });

      } else {
        // --- EXPANDED INDIVIDUAL MARKERS MODE ---
        problems.forEach((prob) => {
          if (!prob.coordinates?.lat || !prob.coordinates?.lng) return;

          const isResolved = prob.status === 'Resolved';
          const isSelected = selectedProblemId === prob.id;

          const domainIcon =
            prob.domain === 'Water' ? 'water_drop' :
            prob.domain === 'Healthcare' ? 'medical_services' :
            prob.domain === 'Agriculture' ? 'agriculture' :
            prob.domain === 'Environment' ? 'forest' :
            prob.domain === 'Energy' ? 'solar_power' :
            prob.domain === 'Education' ? 'school' :
            prob.domain === 'Accessibility' ? 'accessible' :
            prob.domain === 'Public Admin' ? 'account_balance' : 'handshake';

          const markerIcon = new DivIcon({
            className: 'custom-leaflet-pin-icon',
            html: `
              <div style="cursor: pointer;" class="relative flex items-center justify-center ${isSelected ? 'scale-125 z-50' : ''}">
                <div style="width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); border: 2px solid ${isResolved ? '#a7f3d0' : '#fde68a'}; background-color: ${isResolved ? '#059669' : '#d97706'}; color: ${isResolved ? '#ffffff' : '#0f172a'}; ${isSelected ? 'outline: 4px solid white;' : ''}">
                  <span class="material-symbols-outlined" style="font-size: 16px;">${domainIcon}</span>
                </div>
                <div style="position: absolute; top: -2px; right: -2px; width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid #0f172a; background-color: ${isResolved ? '#6ee7b7' : '#fcd34d'};"></div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -18]
          });

          const marker = new Marker([prob.coordinates.lat, prob.coordinates.lng], {
            icon: markerIcon,
            title: `${prob.district}: ${prob.title}`
          });

          const popupContent = document.createElement('div');
          popupContent.className = 'p-3 max-w-[280px] font-sans text-slate-900 select-none';
          popupContent.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 6px;">
              <span style="font-size: 9px; font-weight: 800; text-transform: uppercase; padding: 2px 6px; border-radius: 9999px; background-color: ${isResolved ? '#d1fae5' : '#fef3c7'}; color: ${isResolved ? '#065f46' : '#92400e'};">
                ${isResolved ? '✓ Resolved' : '⏳ In Progress'}
              </span>
              <span style="font-size: 10px; font-weight: 700; color: #64748b; font-family: monospace;">${prob.district}</span>
            </div>
            <h4 style="font-size: 12px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; line-height: 1.3;">
              ${prob.title}
            </h4>
            <p style="font-size: 11px; color: #475569; margin: 0 0 8px 0; line-height: 1.4;">
              ${prob.outcomeSummary}
            </p>
            <div style="padding: 6px 8px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 10px; margin-bottom: 8px;">
              <strong style="color: #059669;">★ Key Metric:</strong> ${prob.keyMetric}
            </div>
            <button
              id="leaflet-story-btn-${prob.id}"
              style="width: 100%; padding: 6px 10px; background-color: #24389c; color: white; border: none; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;"
            >
              <span>View Case Study Story →</span>
            </button>
          `;

          popupContent.addEventListener('click', (e) => {
            if (e.target.closest(`#leaflet-story-btn-${prob.id}`)) {
              onOpenStoryModal(prob);
            }
          });

          const popup = new Popup({
            offset: [0, -14],
            maxWidth: 300
          });
          popup.setContent(popupContent);
          marker.bindPopup(popup);

          marker.on('click', () => {
            onSelectProblem(prob.id);
          });

          layerGroup.addLayer(marker);
          markersMapRef.current.set(prob.id, marker);
        });
      }
    } catch (e) {
      console.warn('Error updating Leaflet layers:', e);
    }
  }, [problems, selectedProblemId, onOpenStoryModal, onSelectProblem]);

  // 2. Initialize Leaflet 2.0 Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Protection against React StrictMode double-mounting on same DOM container
    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }

    try {
      const jharkhandCenter = [23.6102, 85.2799];

      const map = new Map(mapContainerRef.current, {
        center: jharkhandCenter,
        zoom: 7.5,
        minZoom: 6,
        maxZoom: 18,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // CartoDB Voyager tiles (Open & fast)
      const tileLayer = new TileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; OpenStreetMap &copy; CARTO',
          maxZoom: 19,
          subdomains: 'abcd'
        }
      );
      tileLayer.addTo(map);

      const layerGroup = new LayerGroup();
      layerGroup.addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = layerGroup;

      const handleZoomEnd = () => {
        if (mapInstanceRef.current && layerGroupRef.current) {
          renderLayers(mapInstanceRef.current, layerGroupRef.current);
        }
      };
      map.on('zoomend', handleZoomEnd);

      // Force recalculate dimensions once attached
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 150);

      setMapLoaded(true);

      return () => {
        map.off('zoomend', handleZoomEnd);
        map.remove();
        mapInstanceRef.current = null;
        layerGroupRef.current = null;
      };
    } catch (err) {
      console.error('Leaflet initialization error:', err);
      setLoadError(err.message || 'Initialization error');
      setUseVectorFallback(true);
    }
  }, []);

  // 3. Update layers when problems change
  useEffect(() => {
    if (mapLoaded && mapInstanceRef.current && layerGroupRef.current) {
      renderLayers(mapInstanceRef.current, layerGroupRef.current);
    }
  }, [mapLoaded, renderLayers]);

  // 4. Sync when selected problem changes from list panel
  useEffect(() => {
    if (!selectedProblemId || !mapInstanceRef.current) return;

    const prob = problems.find(p => p.id === selectedProblemId);
    if (!prob?.coordinates?.lat || !prob?.coordinates?.lng) return;

    const map = mapInstanceRef.current;
    map.flyTo([prob.coordinates.lat, prob.coordinates.lng], Math.max(map.getZoom(), 10), {
      duration: 0.8
    });

    setTimeout(() => {
      const marker = markersMapRef.current.get(selectedProblemId);
      if (marker) {
        marker.openPopup();
      }
    }, 450);
  }, [selectedProblemId, problems]);

  // Fallback View
  if (loadError || useVectorFallback) {
    return (
      <div className="relative w-full h-full flex flex-col">
        <JharkhandVectorMap
          problems={problems}
          selectedProblemId={selectedProblemId}
          onSelectProblem={onSelectProblem}
          onOpenStoryModal={onOpenStoryModal}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] lg:h-full min-h-[520px] rounded-3xl overflow-hidden border border-outline-variant shadow-lg bg-slate-900">
      
      {/* Loading Skeleton */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-white z-30 space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-300">Loading Leaflet GIS Engine...</p>
        </div>
      )}

      {/* Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Left Watermark */}
      <div className="absolute top-4 left-4 z-[400] pointer-events-none bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-extrabold text-white uppercase tracking-wider">
            Leaflet 2.0 • OpenTiles
          </span>
        </div>
      </div>

      {/* Bottom Vector Toggle Button */}
      <div className="absolute bottom-4 left-4 z-[400]">
        <button
          onClick={() => setUseVectorFallback(true)}
          className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md text-white text-xs font-bold rounded-xl border border-slate-700 shadow-lg flex items-center gap-1.5 cursor-pointer transition-colors"
          title="Switch to custom SVG Vector map"
        >
          <span className="material-symbols-outlined text-[16px] text-sky-400">layers</span>
          <span>Vector Outline View</span>
        </button>
      </div>

    </div>
  );
};
