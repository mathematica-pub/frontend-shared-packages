# Dots Primary Marks Component

The `DotsComponent` allows you to create `SvgCircleElement`s within an `XyChart`, positioned and
styled according to four different dimensions of data that control the `cx`, `cy`, `r`, and `fill`
properties of the circles.

## Config Builder

The `VicDotsConfigBuilder` allows you to create a configuration object for the `DotsComponent`.

It requires one generic type, which should be the type of a single datum in the array of data that
will be passed to the component.

```ts
import { VicDotsConfigBuilder } from '@hsi/viz-components';
...
constructor(private dots: VicDotsConfigBuilder<Datum>) {}
```

### Required Methods

The following methods must be called on `VicDotsConfigBuilder` to create a valid configuration
object.

<div class="builder-method">
  <h4 class="method-name">data</h4>
  <p class="description">Sets the data to be used by the component.</p>
  <div class="params">
    <div class="param">
      <p class="param-def">
        <span class="label">@param</span><span class="name">data:</span><code class="type-def">Datum[]</code>
      </p>
      <p class="param-description">The array of data objects to be used by the component.</p>
    </div>  
  </div>
</div>

<div class="builder-method">
  <p>One of the following methods must be called to set the fill color of the circles.</p>
  <h4 class="method-name">fill</h4>
  <p class="description">Set the fill color for all circles from a <code>string</code>.</p>
  <div class="params">
    <div class="param">
      <p class="param-def">
        <span class="label">@param</span><span class="name">fill:</span><code class="type-def">string</code>
      </p>
      <p class="param-description">A named HTML color ('red') or hex code '#ff0000' value for the <code>fill</code> attribute for all circles.</p>
    </div>  
  </div>
  <h4 class="method-name">fillCategorical</h4>
  <p class="description">Create the specifications for the fill color of the dots using <code>string</code> values.</p>
  <div class="params">
    <div class="param">
      <p class="param-def">
        <span class="label">@param</span><span class="name">fillCategorical:</span><code class="type-def">(
      fill: OrdinalVisualValueDimensionBuilder&lt;Datum, string, string&gt;
    ) => void</code>
      </p>
      <p class="param-description">A callback that allows for specification of how categorical values will be transformed into string values (named HTML colors or hex codes) to be used as values for the <code>fill</code> attribute for circles.</p>
    </div>  
  </div>
  <h4 class="method-name">fillNumeric</h4>
  <p class="description">Create the specifications for the fill color of the dots using <code>number</code> values.</p>
  <div class="params">
    <div class="param">
      <p class="param-def">
        <span class="label">@param</span><span class="name">fillNumeric:</span><code class="type-def">(
      fill: OrdinalVisualValueDimensionBuilder&lt;Datum, number, string&gt;
    ) => void</code>
      </p>
      <p class="param-description">A callback that allows for specification of how numeric values will be transformed into string values (named HTML colors or hex codes) to be used as values for the <code>fill</code> attribute for circles.</p>
    </div>  
  </div>
</div>

<div class="builder-method">
  <p>One of the following methods must be called to set the radius of the circles.</p>
  <h4 class="method-name">radius</h4>
  <p class="description">Set the radius value for all circles from a <code>number</code>.</p>
  <p class="description">May be omitted if either <code>radiusCategorical</code> or <code>radiusNumeric</code> are called.</p>
  <div class="params">
    <div class="param">
      <p class="param-def">
        <span class="label">@param</span><span class="name">radius:</span><code class="type-def">number</code>
      </p>
      <p class="param-description">A number that will be used as the <code>r</code> attribute for all circles.</p>
    </div>  
  </div>
  <h4 class="method-name">radiusCategorical</h4>
  <p class="description">Create the specifications for the radius of the dots using <code>string</code> values.</p>
  <p class="description">May be omitted if either <code>radius</code> or <code>radiusNumeric</code> are called.</p>
  <div class="params">
    <div class="param">
      <p class="param-def">
        <span class="label">@param</span><span class="name">radiusCategorical:</span><code class="type-def">(
      radius: OrdinalVisualValueDimensionBuilder&lt;Datum, string, string&gt;
    ) => void</code>
      </p>
      <p class="param-description">A callback that allows for specification of how categorical values will be transformed into numbers to be used as values for the <code>r</code> attribute for circles.</p>
    </div>  
  </div>
  <h4 class="method-name">radiusNumeric</h4>
  <p class="description">Create the specifications for the radius of the dots using <code>number</code> values.</p>
  <p class="description">May be omitted if either <code>radius</code> or <code>radiusCategorical</code> are called.</p>
  <div class="params">
    <div class="param">
      <p class="param-def">
        <span class="label">@param</span><span class="name">radiusNumeric:</span><code class="type-def">(
      radius: OrdinalVisualValueDimensionBuilder&lt;Datum, number, string&gt;
    ) => void</code>
      </p>
      <p class="param-description">A callback that allows for specification of how numeric values will be transformed into numbers to be used as values for the the <code>r</code> attribute for circles.</p>
    </div>  
  </div>
</div>

<div class="builder-method">
  <p>One of the following methods must be called to set the x position of the circles.</p>
  <h4 class="method-name">xDate</h4>
  <p class="description">Create the specifications for the x position of the circles using <code>Date</code> values.</p>
  <div class="params">
    <div class="param">
      <p class="param-def">
        <span class="label">@param</span><span class="name">x:</span><code class="type-def">(
      x: DateChartPositionDimensionBuilder&lt;Datum&gt;
    ) => void</code>
      </p>
      <p class="param-description">A callback that allows for specification of how Date values will be transformed into x position values to be used for the <code>cx</code> attribute for circles.</p></p>
    </div>  
  </div>
  <h4 class="method-name">xNumeric</h4>
  <p class="description">Create the specifications for the x position of the circles using <code>number</code> values.</p>
  <div class="params">
    <div class="param">
      <p class="param-def">
        <span class="label">@param</span><span class="name">x:</span><code class="type-def">(
      x: NumberChartPositionDimensionBuilder&lt;Datum&gt;
    ) => void</code>
      </p>
      <p class="param-description">A callback that allows for specification of how number values will be transformed into x position values to be used for the <code>cx</code> attribute for circles.</p></p>
    </div>  
  </div>
  <h4 class="method-name">xOrdinal</h4>
  <p class="description">Create the specifications for the x position of the circles using ordinal (string, number or Date) values.</p>
  <div class="params">
    <div class="param">
      <p class="param-def">
        <span class="label">@param</span><span class="name">x:</span><code class="type-def">(
      x: OrdinalChartPositionDimensionBuilder&lt;Datum, Domain&gt;
    ) => void</code>
      </p>
      <p class="param-description">A callback that allows for specification of how ordinal values will be transformed into x position values to be used for the <code>cx</code> attribute for circles.</p></p>
    </div>  
  </div>
</div>

<div class="builder-method">
  <p>One of the following methods must be called to set the y position of the circles.</p>
  <h4 class="method-name">yDate</h4>
  <p class="description">Create the specifications for the y position of the circles using <code>Date</code> values.</p>
  <div class="params">
    <div class="param">
      <p class="param-def">
        <span class="label">@param</span><span class="name">y:</span><code class="type-def">(
      y: DateChartPositionDimensionBuilder&lt;Datum&gt;
    ) => void</code>
      </p>
      <p class="param-description">A callback that allows for specification of how Date values will be transformed into y position values to be used for the <code>cy</code> attribute for circles.</p></p>
    </div>  
  </div>
  <h4 class="method-name">yNumeric</h4>
  <p class="description">Create the specifications for the y position of the circles using <code>number</code> values.</p>
  <div class="params">
    <div class="param">
      <p class="param-def">
        <span class="label">@param</span><span class="name">y:</span><code class="type-def">(
      y: NumberChartPositionDimensionBuilder&lt;Datum&gt;
    ) => void</code>
      </p>
      <p class="param-description">A callback that allows for specification of how number values will be transformed into y position values to be used for the <code>cy</code> attribute for circles.</p></p>
    </div>  
  </div>
  <h4 class="method-name">yOrdinal</h4>
  <p class="description">Create the specifications for the y position of the circles using ordinal (string, number or Date) values.</p>
  <div class="params">
    <div class="param">
      <p class="param-def">
        <span class="label">@param</span><span class="name">y:</span><code class="type-def">(
      y: OrdinalChartPositionDimensionBuilder&lt;Datum, Domain&gt;
    ) => void</code>
      </p>
      <p class="param-description">A callback that allows for specification of how ordinal values will be transformed into y position values to be used for the <code>cy</code> attribute for circles.</p></p>
    </div>  
  </div>
</div>

### Optional Methods

<div class="builder-method">
  <h4 class="method-name">opacity</h4>
  <p class="description">Sets the opacity for each dot.</p>
  <div class="params">
    <div class="param">
      <p class="param-def">
        <span class="label">@param</span><span class="name">opacity:</span><code class="type-def">number</code>
      </p>
      <p class="param-description">A value between 0 and 1 for the `opacity` attribute of the `SVGCircleElement`.</p>
    </div>  
  </div>
</div>

<div class="builder-method">
  <h4 class="method-name">stroke</h4>
  <p class="description">Sets the stroke attributes for each dot.</p>
  <div class="params">
    <div class="param">
      <p class="param-def">
        <span class="label">@param</span><span class="name">stroke:</span><code class="type-def">(stroke: StrokeBuilder) => void</code>
      </p>
      <p class="param-description">A callback that allows for the specification of the attributes for the stroke of the dots.</p>
    </div>  
  </div>
</div>

## Example

{{ DotsExampleComponent }}
