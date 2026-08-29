// Source: Google Maps Platform Code Assist
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { JharkhandVectorMap } from './JharkhandVectorMap';

export const GoogleImpactMap = ({
  problems = [],
  selectedProblemId = null,
  onSelectProblem,
  onOpenStoryModal,
  zoomLevel = 1,
  setZoomLevel
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerClustererRef = useRef(null);
  const markersMapRef = useRef(new Map()); // Map of probId -> { marker, infoWindow }
  const activeInfoWindowRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [useVectorFallback, setUseVectorFallback] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Initialize Google Maps Platform via Loader
  useEffect(() => {
    // If no API key provided, switch gracefully to vector GIS fallback
    if (!apiKey || apiKey === 'your-google-maps-api-key-here' || apiKey.trim() === '') {
      setLoadError('MISSING_API_KEY');
      return;
    }

    let isMounted = true;

    const loader = new Loader({
      apiKey: apiKey.trim(),
      version: 'weekly',
      libraries: ['maps', 'marker'],
      id: '__googleMapsScriptId',
      // Internal usage attribution ID for Google Maps Platform tracking
      internalUsageAttributionIds: 'gmp_mcp_codeassist_v0.1_github'
    });

    loader
      .importLibrary('maps')
      .then(async ({ Map, InfoWindow }) => {
        if (!isMounted || !mapContainerRef.current) return;

        const { AdvancedMarkerElement, PinElement } = await loader.importLibrary('marker');

        // Center on Jharkhand state territory
        const jharkhandCenter = { lat: 23.6102, lng: 85.2799 };

        const map = new Map(mapContainerRef.current, {
          center: jharkhandCenter,
          zoom: 7.5,
          mapId: 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
          mapTypeControl: true,
          mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT
          },
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
          },
          // Sleek modern styling for administrative clarity
          styles: [
            {
              featureType: 'administrative.province',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#1e3a8a' }, { weight: 2 }]
            },
            {
              featureType: 'water',
              elementType: 'geometry.fill',
              stylers: [{ color: '#0284c7' }]
            }
          ]
        });

        mapInstanceRef.current = map;

        // Initialize MarkerClusterer with custom renderer
        const clusterer = new MarkerClusterer({
          map,
          markers: [],
          renderer: {
            render({ count, position }) {
              const div = document.createElement('div');
              div.className =
                'w-11 h-11 rounded-full bg-slate-900 border-2 border-emerald-400 text-white font-extrabold flex flex-col items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform';
              div.innerHTML = `
                <span style="font-size: 13px; color: #6ee7b7; font-family: monospace;">${count}</span>
                <span style="font-size: 8px; text-transform: uppercase; color: #cbd5e1; font-weight: 700; margin-top: -2px;">Impacts</span>
              `;
              return new AdvancedMarkerElement({
                position,
                content: div,
                zIndex: Number(google.maps.Marker?.MAX_ZINDEX || 1000) + count
              });
            }
          }
        });

        markerClustererRef.current = clusterer;
        setMapLoaded(true);
      })
      .catch((err) => {
        console.warn('Google Maps API Loader Error:', err);
        if (isMounted) {
          setLoadError(err.message || 'FAILED_TO_LOAD');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [apiKey]);

  // Render & Update Markers when `problems` filter changes (no full reload)
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !markerClustererRef.current) return;

    const map = mapInstanceRef.current;
    const clusterer = markerClustererRef.current;

    // Clear previous markers
    clusterer.clearMarkers();
    markersMapRef.current.clear();

    const newMarkers = [];

    problems.forEach((prob) => {
      if (!prob.coordinates || !prob.coordinates.lat || !prob.coordinates.lng) return;

      const isResolved = prob.status === 'Resolved';

      // 1. Create PinElement with custom color palette
      const pin = new google.maps.marker.PinElement({
        background: isResolved ? '#059669' : '#d97706', // emerald-600 vs amber-600
        borderColor: isResolved ? '#064e3b' : '#78350f',
        glyphColor: '#ffffff',
        scale: 1.15
      });

      // 2. Create AdvancedMarkerElement
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: prob.coordinates.lat, lng: prob.coordinates.lng },
        title: `${prob.district}: ${prob.title}`,
        content: pin.element,
        gmpClickable: true
      });

      // 3. Create InfoWindow with rich UI content
      const infoWindowContent = document.createElement('div');
      infoWindowContent.className = 'p-3 max-w-[280px] text-slate-900 font-sans select-none';
      infoWindowContent.innerHTML = `
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
          <strong style="color: #059669;">★ Outcome:</strong> ${prob.keyMetric}
        </div>
        <button id="view-story-btn-${prob.id}" style="width: 100%; padding: 6px 10px; background-color: #24389c; color: white; border: none; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
          <span>View Case Study Story →</span>
        </button>
      `;

      // Attach Click Event to the Button in InfoWindow
      infoWindowContent.addEventListener('click', (e) => {
        if (e.target.closest(`#view-story-btn-${prob.id}`)) {
          onOpenStoryModal(prob);
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
        disableAutoPan: false
      });

      // Marker click opens InfoWindow and notifies parent
      marker.addListener('gmp-click', () => {
        if (activeInfoWindowRef.current) {
          activeInfoWindowRef.current.close();
        }
        infoWindow.open({
          anchor: marker,
          map,
          shouldFocus: false
        });
        activeInfoWindowRef.current = infoWindow;
        onSelectProblem(prob.id);
      });

      newMarkers.push(marker);
      markersMapRef.current.set(prob.id, { marker, infoWindow, prob });
    });

    clusterer.addMarkers(newMarkers);
  }, [problems, mapLoaded, onOpenStoryModal, onSelectProblem]);

  // Sync: When selectedProblemId changes from the left panel, center map and open InfoWindow
  useEffect(() => {
    if (!selectedProblemId || !mapLoaded || !mapInstanceRef.current) return;

    const item = markersMapRef.current.get(selectedProblemId);
    if (!item) return;

    const { marker, infoWindow, prob } = item;
    const map = mapInstanceRef.current;

    if (activeInfoWindowRef.current) {
      activeInfoWindowRef.current.close();
    }

    map.panTo({ lat: prob.coordinates.lat, lng: prob.coordinates.lng });
    if (map.getZoom() < 10) {
      map.setZoom(10);
    }

    infoWindow.open({
      anchor: marker,
      map,
      shouldFocus: false
    });
    activeInfoWindowRef.current = infoWindow;
  }, [selectedProblemId, mapLoaded]);

  // Fallback UI or Skeleton
  if (loadError || useVectorFallback) {
    return (
      <div className="relative w-full h-full flex flex-col">
        {/* Banner indicating fallback state */}
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-900 px-4 py-2 rounded-2xl mb-3 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-700 text-base">info</span>
            <span>
              {loadError === 'MISSING_API_KEY'
                ? 'Google Maps API Key not detected — Interactive State GIS Vector Engine active.'
                : 'Google Maps script unavailable — displaying high-fidelity vector map.'}
            </span>
          </div>
          <span className="text-[11px] text-amber-800 font-bold hidden sm:inline">
            Add VITE_GOOGLE_MAPS_API_KEY in .env for Satellite tiles
          </span>
        </div>

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
          <p className="text-xs font-bold text-slate-300">Initializing Google Maps Platform...</p>
          <span className="text-[10px] text-slate-400 font-mono">Loading Advanced Markers &amp; Cluster Engine</span>
        </div>
      )}

      {/* Google Map Container Element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Left Watermark Badge */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-extrabold text-white uppercase tracking-wider">
            Google Maps Platform • Jharkhand
          </span>
        </div>
      </div>

      {/* Switch to Vector View Button */}
      <div className="absolute bottom-4 left-4 z-10">
        <button
          onClick={() => setUseVectorFallback(true)}
          className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md text-white text-xs font-bold rounded-xl border border-slate-700 shadow-lg flex items-center gap-1.5 cursor-pointer transition-colors"
          title="Switch to custom 24-District Vector SVG map"
        >
          <span className="material-symbols-outlined text-[16px] text-sky-400">layers</span>
          <span>Vector Outline View</span>
        </button>
      </div>

    </div>
  );
};
