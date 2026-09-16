import Script from "next/script";

const HEAP_APP_ID = process.env.NEXT_PUBLIC_HEAP_APP_ID;

/**
 * Loads Heap directly (instead of via GTM) using the per-environment app id in
 * NEXT_PUBLIC_HEAP_APP_ID. Set a different value in each Vercel environment
 * (prod / preview / dev) so their data stays separate. Renders nothing when the
 * id is unset, so Heap simply won't load.
 * NOTE: remove/disable the Heap tag in the GTM container so it isn't loaded twice.
 */
export default function HeapLoader() {
  if (!HEAP_APP_ID) return null;

  return (
    <Script id="heap-loader" strategy="afterInteractive">
      {`window.heapReadyCb=window.heapReadyCb||[],window.heap=window.heap||[],heap.load=function(e,t){window.heap.envId=e,window.heap.clientConfig=t=t||{},window.heap.clientConfig.shouldFetchServerConfig=!1;var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src="https://cdn.us.heap-api.com/config/"+e+"/heap_config.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(a,r);var n=["init","startTracking","stopTracking","track","resetIdentity","identify","getSessionId","getUserId","getIdentity","addUserProperties","addEventProperties","removeEventProperty","clearEventProperties","addAccountProperties","addAdapter","addTransformer","addTransformerFn","onReady","addPageviewProperties","removePageviewProperty","clearPageviewProperties","trackPageview"],i=function(e){return function(){var t=Array.prototype.slice.call(arguments,0);window.heapReadyCb.push({name:e,fn:function(){heap[e]&&heap[e].apply(heap,t)}})}};for(var p=0;p<n.length;p++)heap[n[p]]=i(n[p])};heap.load("${HEAP_APP_ID}");`}
    </Script>
  );
}
